import React, { useState } from 'react'

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
      // Add your register API call here
      console.log('Register data:', formData)
      // Example: const response = await registerAPI(formData)
      setSuccess('Account created successfully! Redirecting...')
      setFormData({ username: '', email: '', password: '' })
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 bg-radial-gradient relative flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-950/20 via-zinc-950 to-zinc-950"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Glass Morphism Card */}
        <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl p-8 border border-zinc-800">
          {/* Neural Node Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-zinc-100 mb-1">
              Unlock the Intelligence
            </h1>
            <p className="text-zinc-400 text-sm">Join the neural network</p>
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
              <label htmlFor="username" className="block text-xs font-medium text-zinc-300 mb-2 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose your neural identity"
                className="w-full px-4 py-3 rounded-lg bg-zinc-950 text-zinc-200 placeholder-zinc-600 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 outline-none"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-zinc-300 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-zinc-950 text-zinc-200 placeholder-zinc-600 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 outline-none"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-zinc-300 mb-2 uppercase tracking-wider">
                Neural Key (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong neural key"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-950 text-zinc-200 placeholder-zinc-600 border border-zinc-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400 transition"
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
                  <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
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
              className="w-full py-3 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Initializing Neural Network...' : 'Unlock Intelligence'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-zinc-800"></div>
            <span className="px-3 text-xs text-zinc-500 uppercase tracking-widest">or pass through neural key</span>
            <div className="flex-1 border-t border-zinc-800"></div>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.889-2.126 5.413-5.044 5.972-3.368.608-6.175-1.897-6.175-5.247 0-.668.119-1.307.357-1.918a9.42 9.42 0 0 1 .139-1.626h.001a.02.02 0 0 0 .002-.009 8.9 8.9 0 0 1 10.458 10.45 2.9 2.9 0 0 0 2.529.754c3.616-1.996 5.9-6.216 5.9-11.182 0-.668-.119-1.307-.357-1.918a9.42 9.42 0 0 1-.139-1.626h-.001a.02.02 0 0 0-.002-.009A10.96 10.96 0 0 0 15.545 6.558Z" />
              </svg>
              Continue with Google
            </button>
            <button className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.19.092-.926.35-1.557.636-1.914-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.191 20 14.446 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-zinc-400 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
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