<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        return Inertia::render('vehicles/index', [
            'vehicles' => Vehicle::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('vehicles/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        Vehicle::create($validated);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle added.');
    }

    public function edit(Vehicle $vehicle)
    {
        return Inertia::render('vehicles/edit', [
            'vehicle' => $vehicle,
        ]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate($this->rules($vehicle));

        $vehicle->update($validated);

        return redirect()->route('vehicles.index')->with('success', 'Vehicle updated.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();

        return redirect()->route('vehicles.index')->with('success', 'Vehicle deleted.');
    }

    private function rules(?Vehicle $vehicle = null): array
    {
        return [
            'plate_number' => [
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles', 'plate_number')->ignore($vehicle?->id),
            ],
            'brand' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'capacity_metric_ton' => ['nullable', 'numeric', 'min:0'],
            'capacity_cubic_meter' => ['nullable', 'numeric', 'min:0'],
            'cost_per_km' => ['nullable', 'numeric', 'min:0'],
            'cost_per_hour' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'string', Rule::in(['Available', 'Maintenance', 'Unavailable'])],
        ];
    }
}
