<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
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
        //
    }

    public function planning()
    {
        $orders = Order::all();

        return Inertia::render('orders/planning', [
            'columns' => [
                'morning' => $orders->where('plan_board', 'morning')->values(),
                'pool' => $orders->where('plan_board', 'pool')->values(),
                'evening' => $orders->where('plan_board', 'evening')->values(),
            ],
        ]);
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'columns' => 'required|array',
            'columns.morning' => 'array',
            'columns.pool' => 'array',
            'columns.evening' => 'array',
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
}
