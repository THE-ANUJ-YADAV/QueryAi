import React, { useState } from 'react'
import { register } from '../service/auth.api'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
    setError('')
  }

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '' }
    if (password.length < 6) return { level: 1, text: 'Weak', color: 'text-red-400' }
    if (password.length < 10) return { level: 2, text: 'Fair', color: 'text-yellow-400' }
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { level: 3, text: 'Strong', color: 'text-green-400' }
    }
    return { level: 2, text: 'Fair', color: 'text-yellow-400' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
   try {
    setLoading(true);

    const response = await register(formData);

    setSuccess(response.message);

    setFormData({
        username: "",
        email: "",
        password: ""
    });

    setTimeout(() => {
        window.location.href = "/login";
    }, 2000);

} catch (err) {
    setError(
        err.response?.data?.message ||
        err.message ||
        "Registration failed"
    );
} finally {
    setLoading(false);
}
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#13131a] to-[#0d0d15]">
      {/* Ambient background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Glass Morphism Card */}
        <div className="rounded-2xl border border-white/10 bg-[#16161f]/80 backdrop-blur-md p-8 shadow-2xl">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Query-AI</h1>
              <p className="text-xs text-white/50 mt-1">Join the intelligence</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 bg-green-950/40 border border-green-900/50 rounded-lg text-green-300 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-white/90">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose your identity"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/90">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/90">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-indigo-500/50 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M15.171 13.576l1.472 1.473a10.028 10.028 0 01-1.086 1.701h-.001a10.025 10.025 0 01-6.555 2.226c-4.478 0-8.268-2.943-9.542-7a9.947 9.947 0 011.313-3.671l1.431 1.431a4 4 0 005.771 5.771z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        passwordStrength.level === 1 ? 'w-1/3 bg-red-500' :
                        passwordStrength.level === 2 ? 'w-2/3 bg-yellow-500' :
                        'w-full bg-green-500'
                      }`}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-3 text-xs text-white/50 uppercase tracking-widest">or</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-2">
            <button className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-white/90 transition-all duration-200 hover:bg-white/10 hover:border-white/20">
              Continue with Google
            </button>
            <button className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-white/90 transition-all duration-200 hover:bg-white/10 hover:border-white/20">
              Continue with GitHub
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-white/60">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-indigo-400 transition-colors hover:text-purple-400">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register