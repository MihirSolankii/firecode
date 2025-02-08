import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ReactCodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import ProblemNavbar from '../component/ProblemNavbar.jsx';
import ProblemDescription from '../component/ProblemDescription';
import Editorial from '../component/Editorial';
import MainHeading from '../component/MainHeading';
import Submissions from '../component/Submissions';
import Loading from '../component/Loading';
import { createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




// Custom grey theme to replace Tokyo Night


const ProblemDetail = () => {

    const { id } = useParams();
    const name = localStorage.getItem("name");
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [initCode, setInitCode] = useState("");
    const [currentLang, setCurrentLang] = useState("javascript");
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [editorial, setEditorial] = useState("");
    const [problemDescriptionData, setProblemDescriptionData] = useState();
    const [submissionData, setSubmissionData] = useState();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeNavOption, setActiveNavOption] = useState("description");
    const [testResults, setTestResults] = useState(null);
    const [results, setResults] = useState(null);
    const [testCases, setTestCases] = useState({});
    const [activeTestCase, setActiveTestCase] = useState('')
    const[test,setTest]=useState([]);
  const greyTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#1a1a1a',
    foreground: '#c9c9c9',
    caret: '#c9c9c9',
    selection: '#363636',
    selectionMatch: '#363636',
    lineHighlight: '#202020',
  },
  styles: [
    { tag: t.comment, color: '#6a737d' },
    { tag: t.variableName, color: '#c9c9c9' },
    { tag: t.definition(t.variableName), color: '#c9c9c9' },
    { tag: t.keyword, color: '#d19a66' },
    { tag: t.string, color: '#98c379' },
    { tag: t.number, color: '#d19a66' },
    { tag: t.operator, color: '#c9c9c9' },
    { tag: t.punctuation, color: '#c9c9c9' },
  ],
})
const formatArrayInline = (arr, target) => {
  if (!arr) return '';
  const arrayStr = JSON.stringify(arr).replace(/\[|\]/g, '').replace(/,/g, ', ');
  return target ? `[${arrayStr}], Target: ${target}` : `[${arrayStr}]`;
};

    const submitCode = (name) => {
        setIsSubmitLoading(true);
        if (!name) {
            console.log("id not found");
            setIsSubmitLoading(false);
            return;
        }
        const token = localStorage.getItem("token");
        const problem_name = name;
        axios.post(`https://leetcode-backend-1-5uw5.onrender.com/solution/submit/${name}`, {
            problem_name: problem_name,
            code: code
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(({ data }) => {
            console.log("API Response:", data);
            const testResults = data.subsByName[0].test_cases.map((result, index) => ({
              caseNumber: index + 1,
              ...result
          }));
          setTest(testResults);

            setIsSubmitted(true);
            setSubmissionData(data);
            
            const allPassed =   data.subsByName[0].status==="Accepted";
            console.log("All test cases passed:", allPassed);
            
            if (allPassed) {
              alert("Congratulations! All test cases passed.");
              toast.success("🎉 Congratulations! All test cases passed!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
          } else {
            toast.warning("Some test cases failed. Check details below.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
          }
            setIsSubmitLoading(false);
            if(data.subsByName[0].error) {
            alert(data.subsByName[0].error);
          }
        })
        .catch((err) => {
            console.error(err);
            setIsSubmitLoading(false);
            setIsSubmitted(true);
        });
    };
    const handleSubmit = async () => {
        setIsSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setResults("All test cases passed!")
        setIsSubmitting(false)
      }

    const getEditorial = async() => {
        try {
            const response = await axios.get(`https://leetcode-backend-1-5uw5.onrender.com/leetcode/${name}/editorial`);
            setEditorial(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchProblemDetail = async () => {
            try {
                const name = localStorage.getItem("name");
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://leetcode-backend-1-5uw5.onrender.com/leetcode/problems/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                console.log("name is ",response.data);
                localStorage.setItem("name", response.data.name);
                
                setProblemDescriptionData(response.data);
                console.log("testcase is ",response.data.tests);
                response.data.tests.forEach((test, index) => {
                    const [testCaseInput, targetValue, expectedOutput] = test; // Destructure each test array
                    console.log(`Test ${index + 1}:`);
                    console.log("  Test case input: ", testCaseInput);
                    console.log("  Target value: ", targetValue);
                    console.log("  Expected output: ", expectedOutput);
                    console.log("---------------------");
                  });
                  const formattedTests = response.data.tests.reduce((acc, test, index) => {
                    acc[`case${index + 1}`] = {
                      input: test[0],  // Test case input array
                      target: test[1], // Target value
                      output: test[2], // Expected output
                    };
                    return acc;
                  }, {});
              console.log(formattedTests);
              
                  setTestCases(formattedTests);
                  setActiveTestCase("case1");
                const code = response.data.code_body;
                const value = code.JavaScript;
                setCode(value || 'empty code body');
            } catch (error) {
                console.error('Error fetching problem details:', error);
            }
        };

        fetchProblemDetail();
        getEditorial();
    }, [id, name]);
   
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const testCase = {
    case1: {
      input: "matrix = [[1]], target = 1",
      output: "true"
    },
    case2: {
      input: `matrix = [
  [1,3,5,7],
  [10,11,16,20],
  [23,30,34,60]
], target = 13`,
      output: "false"
    },
    case3: {
      input: "matrix = [[1,2,3]], target = 2",
      output: "true"
    }
  }


    return (
      <div className="min-h-screen bg-zinc-800">
        <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
      <MainHeading data={{ items: [{ text: "Problem List" }] }} />
      <div className="h-[calc(100vh-64px)] bg-zinc-800">
          <ResizablePanelGroup direction="horizontal" className="h-full border border-zinc-700">
              {/* Left Panel - Problem Description */}
              <ResizablePanel defaultSize={50} minSize={30}>
                  <div className="h-full flex flex-col bg-[#1a1a1a] border-r border-zinc-700">
                      <div className="h-[50px] border-b border-zinc-700 bg-[#1a1a1a]">
                          <ProblemNavbar
                              data={{
                                  problem_name: name,
                                  nav_option_name: activeNavOption,
                              }}
                              onNavChange={setActiveNavOption}
                          />
                      </div>
                      <div className="flex-1 overflow-y-auto text-zinc-100 px-6 py-4">
                          {activeNavOption === "description" ? (
                              problemDescriptionData ? (
                                  <ProblemDescription data={problemDescriptionData} />
                              ) : (
                                  <Loading For="pDescription" />
                              )
                          ) : activeNavOption === "editorial" ? (
                              <Editorial data={editorial} />
                          ) : activeNavOption === "Submissions" ? (
                              <Submissions />
                          ) : null}
                      </div>
                  </div>
              </ResizablePanel>

              <ResizableHandle className="w-2 bg-zinc-800 hover:bg-blue-600 transition-colors" />

              {/* Right Panel */}
              <ResizablePanel defaultSize={50} minSize={30}>
                  <ResizablePanelGroup direction="vertical">
                      {/* Code Editor */}
                      <ResizablePanel defaultSize={70}>
                          <div className="h-full flex flex-col bg-[#1a1a1a]">
                              <div className="h-[50px] border-b border-zinc-700 flex items-center px-4">
                                  <span className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-200 text-sm font-medium">
                                      {currentLang}
                                  </span>
                              </div>
                              <div className="flex-1 overflow-hidden">
                                  <ReactCodeMirror
                                      value={code === "" || code == null ? initCode || "" : code || ""}
                                      extensions={[loadLanguage("javascript")]}
                                      theme={greyTheme}
                                      onChange={(value) => setCode(value)}
                                      className="h-full"
                                      basicSetup={{
                                          lineNumbers: true,
                                          highlightActiveLineGutter: true,
                                          highlightActiveLine: true,
                                      }}
                                  />
                              </div>
                          </div>
                      </ResizablePanel>

                      <ResizableHandle className="h-2 bg-zinc-800 hover:bg-blue-600 transition-colors" />

                      {/* Console Section */}
                      <ResizablePanel defaultSize={80}>
    <div className="h-full bg-[#1a1a1a] p-4 flex flex-col overflow-y-auto">
        {/* Tabs for test cases */}
        <div className="h-full bg-[#1a1a1a] p-4 flex flex-col overflow-y-auto">
      {/* Tabs for test cases */}
      <Tabs value={activeTestCase} onValueChange={setActiveTestCase}>
        <div className="border-b mb-4 flex">
          <TabsList className="gap-2">
            {Object.keys(testCases).map((caseKey) => (
              <TabsTrigger
                key={caseKey}
                value={caseKey}
                className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-300"
              >
                Case {caseKey.slice(-1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {Object.entries(testCases).map(([key, testCase]) => (
            <TabsContent key={key} value={key} className="mt-0">
            <div className="space-y-4 text-zinc-200">
                {/* Input Section - Horizontal Format */}
                <div className="p-4 rounded-md bg-zinc-900">
                    <p className="font-mono text-sm mb-2 text-zinc-400">
                        Input:
                    </p>
                    <div className="bg-zinc-800 p-3 rounded-md overflow-x-auto">
                        <code className="text-zinc-200 font-mono">
                            {formatArrayInline(testCase.input, testCase.target)}
                        </code>
                    </div>
                </div>

                {/* Expected Output Section - Horizontal Format */}
                <div className="p-4 rounded-md bg-zinc-900">
                    <p className="font-mono text-sm mb-2 text-zinc-400">
                        Expected Output:
                    </p>
                    <div className="bg-zinc-800 p-3 rounded-md overflow-x-auto">
                        <code className="text-zinc-200 font-mono">
                            {formatArrayInline(testCase.output || testCase.target)}
                        </code>
                    </div>
                </div>

                {/* User Output Section - Only show if there are test results */}
                {test.length > 0 && (
                    <div className="p-4 rounded-md bg-zinc-900">
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-mono text-sm text-zinc-400">
                                Your Output (Case {key.slice(-1)}):
                            </p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                test[parseInt(key.slice(-1)) - 1]?.status === "Accepted"
                                    ? 'bg-green-600/20 text-green-400'
                                    : 'bg-red-600/20 text-red-400'
                            }`}>
                                {test[parseInt(key.slice(-1)) - 1]?.status || 'Not run'}
                            </span>
                        </div>
                        <div className="bg-zinc-800 p-3 rounded-md overflow-x-auto">
                            <code className="text-zinc-200 font-mono">
                                {formatArrayInline(test[parseInt(key.slice(-1)) - 1]?.user_output)}
                            </code>
                        </div>
                    </div>
                )}
            </div>
        </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>

        {/* Sticky Footer */}
        <div className="flex items-center justify-between mt-auto sticky bottom-0 bg-transparent p-4 shadow-md">
            <div className="flex-1 mr-4">
                {results && (
                    <div className="text-sm text-zinc-200 bg-zinc-800 p-3 rounded-md">
                        {results}
                    </div>
                )}
            </div>
            <div className="flex gap-2 h-4  ">
                <Button
                    variant="outline"
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 rounded-[7px] h-9"
                >
                    Run
                </Button>
                <Button
                    onClick={() => submitCode(name)}
                    disabled={isSubmitLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-[7px] h-9"
                >
                    {isSubmitLoading ? (
                        <div className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Running...
                        </div>
                    ) : (
                        "Submit"
                    )}
                </Button>
            </div>
        </div>
    </div>
</ResizablePanel>


                  </ResizablePanelGroup>
              </ResizablePanel>
          </ResizablePanelGroup>
      </div>
  </div>
    );
};

export default ProblemDetail;
