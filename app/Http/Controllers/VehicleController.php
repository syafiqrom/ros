<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        return Inertia::render('vehicles/index', [
            'vehicles' => Vehicle::select('id', 'plate_number', 'brand', 'model', 'capacity', 'status')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('vehicles/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plate_number' => ['required', 'string', 'max:20', 'unique:vehicles,plate_number'],
            'brand' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'status' => ['required', 'in:Available,In Use,Maintenance'],
        ]);

        Vehicle::create($validated);

        return redirect()->route('vehicles.index');
    }

    public function edit(Vehicle $vehicle)
    {
        return Inertia::render('vehicles/edit', [
            'vehicle' => $vehicle,
        ]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'plate_number' => ['required', 'string', Rule::unique('vehicles')->ignore($vehicle->id)],
            'brand' => ['required', 'string'],
            'model' => ['required', 'string'],
            'capacity' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:Available,Maintenance,Unavailable'],
        ]);

        $vehicle->update($validated);

        return to_route('vehicles.index');
    }
}
