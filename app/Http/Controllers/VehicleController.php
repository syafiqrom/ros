<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('vehicles/index', [
            'vehicles' => Vehicle::latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('vehicles/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        Vehicle::create($validated);

        $this->toast('success', 'Vehicle added.');

        return redirect()->route('vehicles.index');
    }

    public function edit(Vehicle $vehicle): Response
    {
        return Inertia::render('vehicles/edit', [
            'vehicle' => $vehicle,
        ]);
    }

    public function update(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $validated = $request->validate($this->rules($vehicle));

        $vehicle->update($validated);

        $this->toast('success', 'Vehicle updated.');

        return redirect()->route('vehicles.index');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $vehicle->delete();

        $this->toast('success', 'Vehicle deleted.');

        return redirect()->route('vehicles.index');
    }

    /**
     * @return array<string, array<int, mixed>|string>
     */
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
