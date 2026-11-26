<?php

namespace App\Http\Controllers;

use App\Models\JobOrder;
use App\Models\Logsheet;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    public function index(): Response
    {
        // return Inertia::render('jobs/index', [
        //     'jobs' => JobOrder::latest()->get(),
        // ]);
    }

    public function planning(Request $request): Response
    {
        $date = $request->query('date');

        $logsheets = Logsheet::query()
            ->when($date, fn ($q) => $q->whereDate('date', $date))
            ->with([
                'jobOrders' => fn ($q) => $q->orderBy('ordinal')->orderBy('id'),
                'jobOrders.order',
            ])
            ->orderBy('id')
            ->get();

        $columns = [];
        $titles = [];

        foreach ($logsheets as $logsheet) {
            $key = 'ls_'.$logsheet->id; // prefix keeps JS from reordering numeric keys

            $titles[$key] = [
                'id' => $logsheet->id,
                'date' => $logsheet->date?->format('Y-m-d'),
                // distinct tzones of the orders in this logsheet (normally just one)
                'tzone' => $logsheet->jobOrders
                    ->pluck('order.tzone')
                    ->filter()
                    ->unique()
                    ->implode(', ') ?: null,
            ];

            $columns[$key] = $logsheet->jobOrders->map(fn ($jo) => [
                'id' => $jo->id,
                'status' => $jo->status,
                'order_id' => $jo->order_id,
                'vbeln' => $jo->order?->vbeln,
                'name' => $jo->order?->name,
                'city' => $jo->order?->city,
                'pdate' => $jo->order?->pdate,
                'volum' => $jo->order?->volum,
            ])->values()->all();
        }

        return Inertia::render('jobs/planning', [
            'columns' => (object) $columns,
            'titles' => (object) $titles,
            'filters' => ['date' => $date],
        ]);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'columns' => 'required|array',
            'columns.*' => 'array',
            'columns.*.*' => 'integer|exists:job_orders,id',
        ]);

        DB::transaction(function () use ($data) {
            foreach ($data['columns'] as $key => $ids) {
                abort_unless(preg_match('/^ls_(\d+)$/', (string) $key, $m), 422);
                $logsheetId = (int) $m[1];

                foreach ($ids as $position => $id) {
                    JobOrder::whereKey($id)->update([
                        'logsheet_id' => $logsheetId,
                        'ordinal' => $position,
                    ]);
                }
            }
        });

        return back();
    }
}
