import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { Database, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { messagesCollection } from "@/db-collections";

export const Route = createFileRoute("/db")({ component: DbPage });

function DbPage() {
  const [text, setText] = useState("");
  const [user, setUser] = useState("访客");

  const { data: messages, isLoading } = useLiveQuery(
    (q) => q.from({ msg: messagesCollection }).orderBy(({ msg }) => msg.id, "desc"),
    [],
  );

  const addMessage = () => {
    if (!text.trim()) return;
    const id = Date.now();
    messagesCollection.insert({
      id,
      text: text.trim(),
      user,
    });
    setText("");
  };

  const removeMessage = (id: number) => {
    messagesCollection.delete(id);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 sm:p-10">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Database className="size-6 text-emerald-500" />
          <h1 className="font-bold text-3xl">TanStack DB</h1>
        </div>
        <p className="text-muted-foreground">
          本地乐观集合 + Live Query — 插入/删除即时响应，无需手动刷新
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="min-h-[420px]">
          <CardHeader>
            <CardTitle className="text-base">消息列表</CardTitle>
            <CardDescription>
              useLiveQuery 自动订阅集合变化，数据实时同步到 UI
            </CardDescription>
          </CardHeader>
          <div className="flex-1 space-y-2 overflow-y-auto px-6 pb-6">
            {isLoading && (
              <p className="text-muted-foreground text-sm">加载中...</p>
            )}
            {!isLoading && messages?.length === 0 && (
              <p className="text-muted-foreground text-sm">
                暂无消息，在右侧添加一条吧
              </p>
            )}
            {messages?.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start justify-between gap-3 rounded-lg border bg-card p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" size="sm">
                      {msg.user}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      #{msg.id}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{msg.text}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeMessage(msg.id)}
                >
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">添加消息</CardTitle>
              <CardDescription>
                调用 collection.insert 乐观插入，UI 立即更新
              </CardDescription>
            </CardHeader>
            <div className="space-y-3 p-6 pt-0">
              <div className="space-y-1">
                <label className="text-muted-foreground text-xs">用户</label>
                <Input
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="用户名"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground text-xs">内容</label>
                <Input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="说点什么..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addMessage();
                  }}
                />
              </div>
              <Button className="w-full" onClick={addMessage} disabled={!text.trim()}>
                <Plus className="size-4" />
                发送
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">集合状态</span>
                <Badge variant="outline">
                  {messages?.length ?? 0} 条记录
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">查询状态</span>
                <Badge variant={isLoading ? "warning" : "success"} size="sm">
                  {isLoading ? "loading" : "ready"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
