import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CardProps = {
  fileType: string;
  url: string;
};

export default function UrlCard({ fileType, url }: CardProps) {
  return (
    <Card className="w-[400px] my-3">
      <CardHeader>
        <CardTitle>URL</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between">
        <p>{url}</p>
        {fileType === "file" ? (
          <Badge variant={"file"}>{fileType}</Badge>
        ) : (
          <Badge variant={"folder"}>{fileType}</Badge>
        )}
      </CardContent>
    </Card>
  );
}
