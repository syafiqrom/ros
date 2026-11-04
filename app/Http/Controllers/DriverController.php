<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('drivers/index', [
            'drivers' => Driver::latest()->get(['id', 'name', 'phone', 'licence_no', 'status', 'created_at']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('drivers/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        Driver::create($validated);

        $this->toast('success', 'Driver added.');

        return redirect()->route('drivers.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Driver $driver): Response
    {
        return Inertia::render('drivers/show', [
            'driver' => $driver->only(['id', 'name', 'phone', 'licence_no', 'status', 'created_at']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Driver $driver): Response
    {
        return Inertia::render('drivers/edit', [
            'driver' => $driver->only(['id', 'name', 'phone', 'licence_no', 'status']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Driver $driver): RedirectResponse
    {
        $validated = $request->validate($this->rules($driver));

        $driver->update($validated);

        $this->toast('success', 'Driver updated.');

        return redirect()->route('drivers.index');
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    private function rules(?Driver $driver = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'licence_no' => ['required', 'string', 'max:50', Rule::unique('drivers', 'licence_no')->ignore($driver)],
            'status' => [$driver ? 'required' : 'nullable', Rule::in(['active', 'inactive'])],
        ];
    }
}
