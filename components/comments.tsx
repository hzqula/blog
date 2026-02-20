"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Pencil, X, Check } from "lucide-react";

interface CommentType {
  id: string;
  name: string;
  email: string;
  message: string;
  userImage: string;
  date: string;
}

interface CommentsProps {
  postSlug: string;
  initialComments?: CommentType[];
}

export default function Comments({
  postSlug,
  initialComments = [],
}: CommentsProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [optimisticComments, setOptimisticComments] = useState<CommentType[]>(
    [],
  );
  const [deletedCommentIds, setDeletedCommentIds] = useState<string[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const OWNER_EMAIL = "hzqoola@gmail.com";

  const displayComments = useMemo(() => {
    const serverActive = initialComments.filter(
      (c) => !deletedCommentIds.includes(c.id),
    );

    const editsMap = new Map<string, CommentType>();
    const newPosts: CommentType[] = [];

    optimisticComments.forEach((c) => {
      const isTempId = c.id.startsWith("0.") && !isNaN(Number(c.id));
      if (isTempId) {
        newPosts.push(c);
      } else {
        editsMap.set(c.id, c);
      }
    });

    const mergedServer = serverActive.map((c) => editsMap.get(c.id) || c);

    const uniqueNewPosts = newPosts.filter((opt) => {
      const isSynced = mergedServer.some(
        (srv) => srv.message === opt.message && srv.email === opt.email,
      );
      return !isSynced;
    });

    return [...uniqueNewPosts, ...mergedServer];
  }, [initialComments, optimisticComments, deletedCommentIds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);

    const tempId = Math.random().toString();

    const tempComment: CommentType = {
      id: tempId,
      name: session?.user?.name || "Guest",
      email: session?.user?.email || "",
      message: message,
      userImage: session?.user?.image || "",
      date: "Baru saja",
    };

    setOptimisticComments((prev) => [tempComment, ...prev]);
    setMessage("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session?.user?.name,
          email: session?.user?.email,
          userImage: session?.user?.image,
          message: tempComment.message,
          postSlug: postSlug,
        }),
      });

      if (res.ok) {
        toast({ title: "Berhasil!", description: "Komentar dikirim." });
        router.refresh();
      } else {
        setOptimisticComments((prev) => prev.filter((c) => c.id !== tempId));
        throw new Error("Gagal");
      }
    } catch (error) {
      setOptimisticComments((prev) => prev.filter((c) => c.id !== tempId));
      toast({
        title: "Gagal",
        description: "Gagal mengirim komentar.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (comment: CommentType) => {
    if (comment.id.startsWith("0.") && !isNaN(Number(comment.id))) {
      toast({
        title: "Tunggu sebentar...",
        description: "Komentar sedang diproses server.",
      });
      return;
    }
    setEditingId(comment.id);
    setEditMessage(comment.message);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditMessage("");
  };

  const handleUpdate = async (comment: CommentType) => {
    if (!editMessage.trim() || editMessage === comment.message) {
      cancelEditing();
      return;
    }

    setIsUpdating(true);

    const updatedComment = { ...comment, message: editMessage };
    const previousOptimistic = [...optimisticComments];

    setOptimisticComments((prev) => {
      const filtered = prev.filter((c) => c.id !== comment.id);
      return [...filtered, updatedComment];
    });

    setEditingId(null);

    try {
      const res = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: comment.id, message: editMessage }),
      });

      if (res.ok) {
        toast({ title: "Berhasil", description: "Komentar diperbarui." });
        router.refresh();
      } else {
        throw new Error("Gagal");
      }
    } catch (error) {
      setOptimisticComments(previousOptimistic);
      toast({
        title: "Error",
        description: "Gagal mengedit komentar.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Yakin ingin menghapus komentar ini?")) return;

    setDeletingId(commentId);
    setDeletedCommentIds((prev) => [...prev, commentId]);

    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (res.ok) {
        toast({ title: "Terhapus", description: "Komentar dihapus." });
        router.refresh();
      } else {
        setDeletedCommentIds((prev) => prev.filter((id) => id !== commentId));
        throw new Error("Gagal");
      }
    } catch (error) {
      setDeletedCommentIds((prev) => prev.filter((id) => id !== commentId));
      toast({
        title: "Error",
        description: "Gagal menghapus komentar.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h3 className="text-xl font-serif font-semibold mb-6">
        Yang Komen ({displayComments.length})
      </h3>

      {/* Input Form */}
      <div className="mb-10">
        {session ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                Masuk sebagai{" "}
                <span className="font-medium text-foreground">
                  {session.user?.name}
                </span>
              </span>
              <Button
                variant="link"
                className="text-xs text-muted-foreground h-auto p-0 ml-auto"
                onClick={() => signOut()}
                type="button"
              >
                Keluar
              </Button>
            </div>
            <Textarea
              placeholder="Tulis tanggapanmu..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] bg-background"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Mengirim...
                  </>
                ) : (
                  "Kirim Komentar"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 bg-secondary/50 rounded-lg text-center border border-border border-dashed">
            <p className="text-muted-foreground mb-4 text-sm">
              Login dengan Google untuk ikut ngomenin tulisan ini.
            </p>
            <Button onClick={() => signIn("google")} variant="outline">
              Login dengan Google
            </Button>
          </div>
        )}
      </div>

      {/* List Komentar */}
      <div className="space-y-8 mt-10">
        {displayComments.length > 0 ? (
          displayComments.map((comment) => {
            const isAuthor = session?.user?.email === comment.email;
            const isOwner = session?.user?.email === OWNER_EMAIL;
            const canEdit = isAuthor;
            const canDelete = isAuthor || isOwner;
            const isEditing = editingId === comment.id;

            return (
              <div
                key={comment.id}
                className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2"
              >
                <Avatar className="h-10 w-10 border border-border shrink-0">
                  <AvatarImage src={comment.userImage} alt={comment.name} />
                  <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1 min-w-0">
                  {/* Header: nama+tanggal di kiri, tombol aksi di kanan */}
                  <div className="flex items-start justify-between gap-2">
                    {/* Nama dan tanggal — di mobile tanggal turun ke bawah nama */}
                    <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                      <h4 className="font-medium text-sm leading-snug">
                        {comment.email === OWNER_EMAIL ? (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 font-bold">
                            PENULIS
                          </span>
                        ) : (
                          comment.name
                        )}
                      </h4>
                      <span className="text-xs text-muted-foreground md:before:content-['•'] md:before:mr-2">
                        {comment.date}
                      </span>
                    </div>

                    {/* Tombol edit/hapus */}
                    {!isEditing && (
                      <div className="flex gap-1 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => startEditing(comment)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(comment.id)}
                            disabled={deletingId === comment.id}
                          >
                            {deletingId === comment.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        className="min-h-20 bg-background text-sm"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEditing}
                          disabled={isUpdating}
                        >
                          <X className="h-3 w-3 mr-1" /> Batal
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(comment)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-3 w-3 mr-1" /> Simpan
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {comment.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm text-muted-foreground italic py-8">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        )}
      </div>
    </div>
  );
}
