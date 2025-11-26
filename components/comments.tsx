// components/comments.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react"; // Tambah useEffect
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

  // STATE BARU: Kita simpan komentar di state agar bisa dimanipulasi instan
  const [comments, setComments] = useState<CommentType[]>(initialComments);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const OWNER_EMAIL = "hzqoola@gmail.com";

  // Efek: Jika server berhasil fetch data baru (misal saat navigasi balik), sync state lokal
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // 1. Optimistic Update: Buat objek komentar sementara
    const tempComment: CommentType = {
      id: Math.random().toString(), // ID sementara
      name: session?.user?.name || "Guest",
      email: session?.user?.email || "",
      message: message,
      userImage: session?.user?.image || "",
      date: "Baru saja", // Tanda bahwa ini baru
    };

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
        // 2. Langsung update UI tanpa nunggu refresh server
        setComments((prev) => [tempComment, ...prev]);

        setMessage("");
        toast({
          title: "Berhasil!",
          description: "Komentar kamu berhasil dikirim.",
        });

        // 3. Refresh server tetap dijalankan untuk sinkronisasi jangka panjang
        router.refresh();
      } else {
        throw new Error("Gagal mengirim");
      }
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengirim komentar.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Yakin ingin menghapus komentar ini?")) return;

    setDeletingId(commentId);

    try {
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (res.ok) {
        // Optimistic Delete: Langsung hilangkan dari layar
        setComments((prev) => prev.filter((c) => c.id !== commentId));

        toast({ title: "Terhapus", description: "Komentar berhasil dihapus." });
        router.refresh();
      } else {
        throw new Error("Gagal menghapus");
      }
    } catch (error) {
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
        Diskusi ({comments.length}) {/* Pakai length dari state */}
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
                type="button" // Tambahkan type button agar tidak submit form
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

      {/* Bagian List Komentar: RENDER DARI STATE 'comments', BUKAN 'initialComments' */}
      <div className="space-y-8 mt-10">
        {comments.length > 0 ? (
          comments.map((comment) => {
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
