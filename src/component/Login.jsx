import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import { Code2, Mail, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from 'axios';
import './login.css'
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/user/login', { email, password });

      const { token, userId, role } = response.data;
      console.log("Token:", token, "User ID:", userId, "Role:", role);

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);

      login(email);
      navigate(role === 'Admin' ? '/admin' : '/dashboard');

    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Animated Stripe Border Effect */}
      <div className="absolute inset-0 bg-black"></div>

      {/* Login Card with Stripe Border */}
      <Card className="relative w-full max-w-md p-[3px] bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500 animate-border rounded-lg">
        <div className="bg-black rounded-lg p-6 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-2">
              <Code2 className="w-6 h-6" />
              Log in to FireCode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-zinc-800 text-white border-none focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-zinc-800 text-white border-none focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 transition-transform transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between text-gray-400">
            <Link to="/forgot-password" className="text-sm hover:text-orange-500 transition">
              Forgot password?
            </Link>
            <Link to="/signup" className="text-sm hover:text-orange-500 transition">
              Create an account
            </Link>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default Login;
