// components/comments.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

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

  // STATE TERPISAH: Jangan campur aduk data server dan lokal
  const [optimisticComments, setOptimisticComments] = useState<CommentType[]>(
    []
  );
  const [deletedCommentIds, setDeletedCommentIds] = useState<string[]>([]);

  // Loading state untuk tombol hapus spesifik
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const OWNER_EMAIL = "hzqoola@gmail.com";

  // LOGIKA PENGGABUNGAN CERDAS (The Smart Merge)
  // Kita menggabungkan data server (initialComments) dengan data lokal (optimistic)
  // Sambil memfilter data yang sudah dihapus secara lokal
  const displayComments = useMemo(() => {
    // 1. Gabungkan komentar server + komentar baru lokal
    const combined = [...optimisticComments, ...initialComments];

    // 2. Filter duplikat (jika server akhirnya sudah memuat komentar baru kita)
    // Kita cek berdasarkan isi pesan & email karena ID server dan lokal beda
    const uniqueComments = combined.filter(
      (comment, index, self) =>
        index ===
        self.findIndex(
          (c) =>
            c.id === comment.id || // Cek ID sama
            (c.message === comment.message &&
              c.email === comment.email &&
              c.date === comment.date) // Cek konten sama (deduplikasi)
        )
    );

    // 3. Buang komentar yang ada di daftar hapus lokal
    return uniqueComments.filter((c) => !deletedCommentIds.includes(c.id));
  }, [initialComments, optimisticComments, deletedCommentIds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Buat ID sementara (random)
    const tempId = Math.random().toString();

    const tempComment: CommentType = {
      id: tempId,
      name: session?.user?.name || "Guest",
      email: session?.user?.email || "",
      message: message,
      userImage: session?.user?.image || "",
      date: "Baru saja",
    };

    // UPDATE OPTIMISTIC: Langsung masukkan ke state lokal khusus
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
          message: message,
          postSlug: postSlug,
        }),
      });

      if (res.ok) {
        toast({ title: "Berhasil!", description: "Komentar dikirim." });
        // Refresh server tetap jalan untuk sinkronisasi jangka panjang
        // Tapi UI tidak akan flicker karena kita pakai displayComments
        router.refresh();
      } else {
        // Rollback jika gagal
        setOptimisticComments((prev) => prev.filter((c) => c.id !== tempId));
        throw new Error("Gagal mengirim");
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

  const handleDelete = async (commentId: string) => {
    if (!confirm("Yakin ingin menghapus komentar ini?")) return;

    setDeletingId(commentId);

    // UPDATE OPTIMISTIC: Masukkan ID ke daftar hapus lokal
    setDeletedCommentIds((prev) => [...prev, commentId]);

    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (res.ok) {
        toast({ title: "Terhapus", description: "Komentar berhasil dihapus." });
        router.refresh();
      } else {
        // Rollback jika gagal (kembalikan ke tampilan)
        setDeletedCommentIds((prev) => prev.filter((id) => id !== commentId));
        throw new Error("Gagal menghapus");
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
        Diskusi ({displayComments.length})
      </h3>

      {/* Bagian Input Komentar */}
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

      {/* Bagian List Komentar: RENDER DARI 'displayComments' */}
      <div className="space-y-8 mt-10">
        {displayComments.length > 0 ? (
          displayComments.map((comment) => {
            const isAuthor = session?.user?.email === comment.email;
            const isOwner = session?.user?.email === OWNER_EMAIL;
            const canDelete = isAuthor || isOwner;

            return (
              <div
                key={comment.id}
                className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2"
              >
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={comment.userImage} alt={comment.name} />
                  <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">
                        {comment.name}
                        {comment.email === OWNER_EMAIL && (
                          <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                            AUTHOR
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        • {comment.date}
                      </span>
                    </div>

                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
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
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {comment.message}
                  </p>
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
