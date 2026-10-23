
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type DemoRole = 'admin' | 'waiter' | 'kitchen';

const dashboards: Record<DemoRole, string> = {
    admin: '/admin',
    waiter: '/staff/orders',
    kitchen: '/kitchen',
};

export default function LoginPage() {
    const navigate = useNavigate();

    const [role, setRole] = useState<DemoRole>('waiter');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Please enter your email and password.');
            return;
        }

        // Frontend demo only. No backend or authentication.
        navigate(dashboards[role]);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
            <section className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
                <Link
                    to="/"
                    className="text-sm text-slate-400 transition hover:text-white"
                >
                    ← Back to TABLEFLOW
                </Link>

                <div className="mb-8 mt-8">
                    <p className="text-sm font-bold tracking-[0.3em] text-emerald-400">
                        TABLEFLOW
                    </p>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight">
                        Welcome back
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Sign in to preview your restaurant dashboard.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-200"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="demo@tableflow.com"
                            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-200"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter any demo password"
                            className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <p className="mb-3 text-sm font-medium text-slate-200">
                            Choose your dashboard
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                            {(['admin', 'waiter', 'kitchen'] as DemoRole[]).map(
                                (item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setRole(item)}
                                        aria-pressed={role === item}
                                        className={`rounded-lg border px-2 py-3 text-sm capitalize transition ${role === item
                                                ? 'border-emerald-400 bg-emerald-400/10 font-semibold text-emerald-300'
                                                : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-[0.99]"
                    >
                        Continue to Dashboard
                    </button>
                </form>

                <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                    Demo mode · No real authentication is performed.
                </p>
            </section>
        </main>
    );
}
