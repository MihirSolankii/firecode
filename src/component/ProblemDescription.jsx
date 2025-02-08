import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { changeCase, kebabToSpacedPascal } from "../ts/string";

const ProblemDescription = ({ data }) => {
    console.log(data);
    
  const [isStarred, setIsStarred] = useState(data.is_starred || false);
  const [likeStatus, setLikeStatus] = useState(data.like_status || "none");

  const formatTestCase = (test) => {
    if (Array.isArray(test)) {
      return test.map((item, index) => (
        <div key={index} className="mb-2">
          {index === 0 && <span className="text-gray-400">Input: </span>}
          {index === test.length - 1 && <span className="text-gray-400">Output: </span>}
          <code className="bg-[#282c34] px-1.5 py-0.5 rounded text-[#e5c07b]">
            {Array.isArray(item) ? `[${item.join(',')}]` : item}
          </code>
        </div>
      ));
    }
    return test;
  };

  return (
    <Card className="bg-[#1e1e1e] border-[#3e3e3e] shadow-lg">
      <CardHeader className="border-b border-[#3e3e3e]">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl text-white">
                <span className="text-[#8a8a8a]">#{data.id}.</span>{" "}
                {kebabToSpacedPascal(data.name)}
              </CardTitle>
              {data.solved && (
                <Badge variant="outline" className="bg-[#2cbb5d]/20 text-[#2cbb5d] border-[#2cbb5d]/50">
                  <Check className="w-3 h-3 mr-1" />
                  Solved
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className={`${
                  data.difficulty === "Easy"
                    ? "text-[#2cbb5d] border-[#2cbb5d]/50"
                    : data.difficulty === "Medium"
                    ? "text-[#ffc01e] border-[#ffc01e]/50"
                    : "text-[#ef4743] border-[#ef4743]/50"
                }`}
              >
                {changeCase(data.difficulty, "pascal")}
              </Badge>
              <span className="text-sm text-[#8a8a8a]">
                Acceptance Rate:{" "}
                <span className="text-[#3ca7fe]">
                  {(data.acceptance_rate_count * 100).toFixed(2)}%
                </span>
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`${isStarred ? "text-[#ffc01e]" : "text-[#8a8a8a]"} hover:text-[#ffc01e] hover:bg-[#ffc01e]/10`}
            onClick={() => setIsStarred(!isStarred)}
          >
            <Star className="h-5 w-5" fill={isStarred ? "currentColor" : "none"} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="description" className="space-y-6">
          <TabsList className="border-b border-[#3e3e3e] w-full justify-start rounded-none bg-transparent">
            <TabsTrigger
              value="description"
              className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#3ca7fe] rounded-none text-[#8a8a8a] hover:text-white transition-colors"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="examples"
              className="data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#3ca7fe] rounded-none text-[#8a8a8a] hover:text-white transition-colors"
            >
              Examples
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="text-[#c8c8c8] space-y-6">
            <div className="space-y-4">
              <p>{data.description_body}</p>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#8a8a8a]">Submissions</h3>
                  <p className="text-lg font-bold text-white">{data.submission_count}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#8a8a8a]">Discussions</h3>
                  <p className="text-lg font-bold text-white">{data.discussion_count}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#8a8a8a]">Solutions</h3>
                  <p className="text-lg font-bold text-white">{data.solution_count}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            {data.tests.map((test, index) => (
              <Card key={index} className="bg-[#282c34] border-[#3e3e3e]">
                <CardHeader>
                  <CardTitle className="text-sm text-white">Example {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {formatTestCase(test)}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Constraints:</h2>
            <ul className="list-disc list-inside text-[#c8c8c8] space-y-2">
              {data.constraints?.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Related Topics</h2>
            <div className="flex flex-wrap gap-2">
              {data.related_topics.map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="bg-[#3ca7fe]/10 text-[#3ca7fe] border-[#3ca7fe]/30 hover:bg-[#3ca7fe]/20 transition-colors"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#3e3e3e] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={`${
                likeStatus === "liked" ? "text-[#2cbb5d]" : "text-[#8a8a8a]"
              } hover:text-[#2cbb5d] hover:bg-[#2cbb5d]/10`}
              onClick={() =>
                setLikeStatus(
                  likeStatus === "disliked" || likeStatus === "none" ? "liked" : "none"
                )
              }
            >
              <ThumbsUp className="h-5 w-5" fill={likeStatus === "liked" ? "currentColor" : "none"} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${
                likeStatus === "disliked" ? "text-[#ef4743]" : "text-[#8a8a8a]"
              } hover:text-[#ef4743] hover:bg-[#ef4743]/10`}
              onClick={() =>
                setLikeStatus(
                  likeStatus === "liked" || likeStatus === "none" ? "disliked" : "none"
                )
              }
            >
              <ThumbsDown
                className="h-5 w-5"
                fill={likeStatus === "disliked" ? "currentColor" : "none"}
              />
            </Button>
          </div>
          <span className="text-[#8a8a8a] text-sm">
            {data.like_count} likes · {data.dislike_count} dislikes
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemDescription;

