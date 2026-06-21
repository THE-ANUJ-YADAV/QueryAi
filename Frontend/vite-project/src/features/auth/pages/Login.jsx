import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    const { handleLogin } = useAuth()

    const navigate = useNavigate()

    const submitForm = async (event) => {
        event.preventDefault()

        const payload = {
            email,
            password,
        }

        await handleLogin(payload)
        navigate("/")

    }

    if(!loading && user){
        return <Navigate to="/" replace />
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#13131a] to-[#0d0d15]">
            {/* Ambient background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="rounded-2xl border border-white/10 bg-[#16161f]/80 backdrop-blur-md p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="mb-8 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Query-AI</h1>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-white">Welcome Back</h2>
                        <p className="mt-2 text-sm text-white/60">Sign in to continue your conversation</p>
                    </div>

                    <form onSubmit={submitForm} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/90">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/30"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/90">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/30"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Login
                        </button>
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-white/10"></div>
                        <span className="px-3 text-xs text-white/50 uppercase tracking-widest">or</span>
                        <div className="flex-1 border-t border-white/10"></div>
                    </div>

                    <div className="space-y-2">
                        <button className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-white/90 transition-all duration-200 hover:bg-white/10 hover:border-white/20">
                            Continue with Google
                        </button>
                        <button className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-white/90 transition-all duration-200 hover:bg-white/10 hover:border-white/20">
                            Continue with GitHub
                        </button>
                    </div>

                    <p className="mt-6 text-center text-sm text-white/60">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="font-semibold text-indigo-400 transition-colors hover:text-purple-400">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login