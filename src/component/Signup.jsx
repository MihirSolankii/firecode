import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';
import { Code2, Mail, Lock, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isAdmin = email === 'mihiradminleet123@gmail.com';

    try {
      const response = await axios.post('https://leetcode-backend-yizw.onrender.com/user/register', { 
        name, 
        email, 
        password, 
        isAdmin 
      });

      console.log(response);
      const { token, userId, newUser } = response.data;
      console.log("token is ", token, "userId is ", userId, "newUser is ", newUser);
      localStorage.setItem('token', token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("newUser", newUser.role);

      if (response) {
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-md p-6 relative bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg border border-transparent 
        before:absolute before:inset-0 before:-z-10 before:rounded-lg 
        before:bg-gradient-to-r before:from-orange-500 before:via-blue-500 before:to-purple-500 
        before:animate-borderGlow">
        <div className='bg-black '>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-2">
            <Code2 className="w-6 h-6" />
            Create an account
          </CardTitle>
          <CardDescription className="text-gray-300">
            Enter your details to sign up for our platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-zinc-800 text-white border-none focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
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
                {isLoading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-gray-400">
          <p className="text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
