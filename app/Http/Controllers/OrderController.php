<?php

namespace App\Http\Controllers;

use App\Imports\OrderImport;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                'required',
                'file',
                'mimes:xlsx,xls,csv,txt',
                'max:10240',
                function ($attribute, $value, $fail) {
                    if (! str_starts_with($value->getClientOriginalName(), 'DO')) {
                        $fail('The file name must start with DO.');
                    }
                },
            ],
        ]);

        Excel::import(new OrderImport, $validated['file']);

        return redirect()
            ->route('orders.index')
            ->with('success', 'Orders imported successfully.');
    }

    public function planning(): Response
    {
        $orders = Order::all();

        return Inertia::render('orders/planning', [
            'columns' => [
                'L01' => $orders->where('plan_board', 'L01')->values(),
                'L02' => $orders->where('plan_board', 'L02')->values(),
                'L03' => $orders->where('plan_board', 'L03')->values(),
                'L04' => $orders->where('plan_board', 'L04')->values(),
                'L05' => $orders->where('plan_board', 'L05')->values(),
                'L06' => $orders->where('plan_board', 'L06')->values(),
                'L07' => $orders->where('plan_board', 'L07')->values(),
                'L08' => $orders->where('plan_board', 'L08')->values(),
                'L09' => $orders->where('plan_board', 'L09')->values(),
                'L10' => $orders->where('plan_board', 'L10')->values(),
                'L11' => $orders->where('plan_board', 'L11')->values(),
                'L12' => $orders->where('plan_board', 'L12')->values(),
                'L13' => $orders->where('plan_board', 'L13')->values(),
            ],
        ]);
    }

    public function reorder(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'columns' => 'required|array',
            'columns.*.*' => 'integer|exists:orders,id',
        ]);

        DB::transaction(function () use ($data) {
            foreach ($data['columns'] as $slot => $ids) {
                foreach ($ids as $position => $id) {
                    Order::whereKey($id)->update([
                        'plan_board' => $slot,
                        // 'position' => $position,
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
