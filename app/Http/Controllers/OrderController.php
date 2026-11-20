<?php

namespace App\Http\Controllers;

use App\Imports\OrderImport;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('orders/index', [
            'orders' => Order::latest()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => [
                'required', 'file', 'mimes:xlsx,xls,csv,txt', 'max:10240',
                function ($attribute, $value, $fail) {
                    if (! str_starts_with($value->getClientOriginalName(), 'DO')) {
                        $fail('The file name must start with DO.');
                    }
                },
            ],
        ]);

        $id = (string) Str::uuid();
        Cache::put("import:$id", ['status' => 'queued', 'total' => null], 3600);
        Cache::put("import:$id:processed", 0, 3600);

        Excel::queueImport(new OrderImport($id), $validated['file']);

        return redirect()
            ->route('orders.index')
            ->with('success', 'Import started.')
            ->with('import_id', $id);
    }

    public function importStatus(string $id): JsonResponse
    {
        $meta = Cache::get("import:$id");

        if (! $meta) {
            return response()->json(['status' => 'unknown', 'total' => null, 'processed' => 0]);
        }

        $processed = (int) Cache::get("import:$id:processed", 0);
        if ($meta['total'] !== null) {
            $processed = min($processed, $meta['total']);
        }

        return response()->json($meta + ['processed' => $processed]);
    }

    public function planning(Request $request): Response
    {
        $date = $request->query('date'); // yyyy-mm-dd or null

        $groupKeys = ['vbeln', 'pdate', 'name', 'addr1', 'addr2', 'city', 'region', 'tzone'];

        // first row id of each order group, with the group's summed volume
        $totals = Order::query()
            ->when($date, fn ($q) => $q->whereDate('pdate', $date))
            ->select(DB::raw('MIN(id) as id'), DB::raw('SUM(volum) as total_volum'))
            ->groupBy($groupKeys)
            ->pluck('total_volum', 'id');

        $orders = Order::whereIn('id', $totals->keys())
            ->orderBy('position')
            ->orderBy('id')
            ->get()
            ->each(fn ($o) => $o->volum = (float) $totals[$o->id]);

        $columns = collect(range(1, 13))->mapWithKeys(fn ($i) => [
            $key = sprintf('L%02d', $i) => $orders->where('plan_board', $key)->values(),
        ]);

        return Inertia::render('orders/planning', [
            'columns' => $columns,
            'filters' => ['date' => $date],
        ]);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'columns' => 'required|array',
            'columns.*' => 'array',
            'columns.*.*' => 'integer|exists:orders,id',
        ]);

        DB::transaction(function () use ($data) {
            foreach ($data['columns'] as $slot => $ids) {
                abort_unless(preg_match('/^L\d{2}$/', (string) $slot), 422);

                foreach ($ids as $position => $id) {
                    Order::whereKey($id)->update([
                        'plan_board' => $slot,
                        'position' => $position,
                    ]);
                }
            }
        });

        return back();
    }

    public function map(): Response
    {
        return Inertia::render('orders/map-view');
    }
}
