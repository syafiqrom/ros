<?php

namespace App\Http\Controllers;

use App\Models\JobOrder;
use App\Models\LogSheet;
use App\Models\Order;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LogsheetController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('logsheets/index', [
            'logsheets' => LogSheet::latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('logsheets/create', [
            'vehicles' => $this->vehicleOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        LogSheet::create($this->validated($request));

        return redirect()->route('logsheets.index')
            ->with('success', 'Log sheet created.');
    }

    public function show(LogSheet $logsheet): Response
    {
        // return Inertia::render('logsheets/show', [
        //     'logsheet' => $logsheet->load('vehicle'),
        // ]);
    }

    public function edit(LogSheet $logsheet): Response
    {
        $orders = Order::where(function ($query) use ($logsheet) {
            $query->whereNotIn('id', JobOrder::select('order_id'))
                ->orWhereIn('id', JobOrder::where('logsheet_id', $logsheet->id)->select('order_id'));
        })->get(['id', 'vbeln', 'pdate', 'name', 'addr1', 'addr2', 'city', 'region', 'tzone', 'volum']);

        $selectedVbelns = Order::whereIn(
            'id',
            JobOrder::where('logsheet_id', $logsheet->id)->select('order_id')
        )->pluck('vbeln');

        return Inertia::render('logsheets/edit', [
            'logsheet' => $logsheet,
            'vehicles' => $this->vehicleOptions(),
            'orders' => $orders,
            'selectedVbelns' => $selectedVbelns,
        ]);
    }

    public function update(Request $request, LogSheet $logsheet): RedirectResponse
    {
        $logsheet->update($this->validated($request));

        return redirect()->route('logsheets.index')
            ->with('success', 'Log sheet updated.');
    }

    public function storeJobOrder(Request $request, LogSheet $logsheet)
    {
        $validated = $request->validate([
            'vbeln' => ['required', 'array', 'min:1'],
            'vbeln.*' => ['string', 'distinct', 'exists:orders,vbeln'],
        ]);

        $count = DB::transaction(function () use ($validated, $logsheet) {
            // translate selected vbeln values into order ids
            $orderIds = Order::whereIn('vbeln', $validated['vbeln'])
                ->pluck('id')
                ->all();

            // skip orders that already have a job order
            $existing = JobOrder::whereIn('order_id', $orderIds)
                ->pluck('order_id')
                ->all();

            $newIds = array_values(array_diff($orderIds, $existing));

            if (empty($newIds)) {
                return 0;
            }

            $now = now();

            JobOrder::insert(array_map(fn ($orderId) => [
                'logsheet_id' => $logsheet->id,
                'order_id' => $orderId,
                'ordinal' => 0,
                'status' => 'New',
                'created_at' => $now,
                'updated_at' => $now,
            ], $newIds));

            return count($newIds);
        });

        return back()->with('success', "{$count} order(s) added to log sheet.");
    }

    public function destroy(LogSheet $logsheet): RedirectResponse
    {
        $logsheet->delete();

        return redirect()->route('logsheets.index')
            ->with('success', 'Log sheet deleted.');
    }

    private function vehicleOptions(): Collection
    {
        return Vehicle::orderBy('plate_number')
            ->get(['id', 'plate_number', 'brand', 'model']);
    }

    private function validated(Request $request): array
    {
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'status' => ['required', 'string', Rule::in(['New', 'Dispatched'])],
            'vehicle_id' => ['required', Rule::exists('vehicles', 'id')->whereNull('deleted_at')],
            'start_load_date' => ['nullable', 'date'],
            'start_load_time' => ['nullable', 'date_format:H:i', 'required_with:start_load_date'],
            'dispatch_date' => ['nullable', 'date', 'required_with:dispatch_time', 'after_or_equal:start_load_date'],
            'dispatch_time' => ['nullable', 'date_format:H:i', 'required_with:dispatch_date'],
        ]);

        // Same-day dispatch must not be earlier than start load.
        if (
            ! empty($validated['start_load_date'])
            && ! empty($validated['dispatch_date'])
            && $validated['start_load_date'] === $validated['dispatch_date']
            && ! empty($validated['start_load_time'])
            && ! empty($validated['dispatch_time'])
            && $validated['dispatch_time'] < $validated['start_load_time']
        ) {
            throw ValidationException::withMessages([
                'dispatch_time' => 'Dispatch time must be after the start load time.',
            ]);
        }

        return $validated;
    }
}
