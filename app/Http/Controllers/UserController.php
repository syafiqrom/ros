<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('users/index', [
            'users' => User::select('id', 'name', 'email', 'role', 'status', 'email_verified_at', 'created_at')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        User::create($validated);

        $this->toast('success', 'User added.');

        return redirect()->route('users.index');
    }

    public function show(User $user): Response
    {
        return Inertia::render('users/show', [
            'user' => $user->only(['id', 'name', 'email', 'role', 'status', 'email_verified_at', 'created_at']),
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $user->only(['id', 'name', 'email', 'role', 'status']),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate($this->rules($user));

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        $this->toast('success', 'User updated.');

        return redirect()->route('users.index');
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_if($user->is(auth()->user()), 403, 'You cannot delete your own account.');

        $user->delete();

        $this->toast('success', 'User deleted.');

        return redirect()->route('users.index');
    }

    /**
     * @return array<string, array<int, mixed>|string>
     */
    private function rules(?User $user = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'role' => ['required', Rule::in(['planner', 'manager'])],
            'status' => [$user ? 'required' : 'nullable', Rule::in(['active', 'inactive'])],
            'password' => [$user ? 'nullable' : 'required', 'confirmed', Password::defaults()],
        ];
    }
}
