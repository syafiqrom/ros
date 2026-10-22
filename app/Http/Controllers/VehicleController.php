<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        return Inertia::render('vehicles/index', [
            'vehicles' => Vehicle::latest()->get(),
        ]);
    }
}
