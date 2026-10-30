<?php

namespace App\Http\Controllers;

use App\Imports\KpiReportImport;
use App\Models\Kpi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class KpiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('kpi/index', [
            'kpi_reports' => Kpi::latest()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'file' => [
                'required',
                'file',
                'mimes:xlsx,xls,csv,txt',
                'max:10240',
                function ($attribute, $value, $fail) {
                    if (! str_starts_with($value->getClientOriginalName(), 'KPI_Report_')) {
                        $fail('The file name must start with KPI_Report_.');
                    }
                },
            ],
        ]);

        Excel::import(new KpiReportImport, $validated['file']);

        return redirect()
            ->route('kpi.index')
            ->with('success', 'KPI report imported successfully.');
    }
}
