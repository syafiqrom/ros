<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

abstract class Controller
{
    protected function toast(string $type, string $message): void
    {
        Inertia::flash('toast', ['type' => $type, 'message' => $message]);
    }
}
