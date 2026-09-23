import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

if (req.method === "OPTIONS") {
  return new Response(null, { status: 200, headers: corsHeaders });
}

// @ts-ignore — Deno global
Deno.serve(async (req: Request) => {
  try {
    const supabase = createClient(
      // @ts-ignore — Deno env
      Deno.env.get("SUPABASE_URL")!,
      // @ts-ignore — Deno env
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const url = new URL(req.url);
    const path = url.pathname.replace("/functions/v1/admin-portal", "");
    const body = await req.json().catch(() => ({}));

    // === LOGIN: verify admin password ===
    if (path === "/login" && req.method === "POST") {
      const { password } = body;
      if (!password) {
        return new Response(JSON.stringify({ error: "กรุณากรอกรหัสผ่าน" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: settings, error: settingsError } = await supabase
        .from("club_settings")
        .select("admin_password_hash")
        .eq("id", 1)
        .maybeSingle();

      if (settingsError || !settings) {
        return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาดในระบบ" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify password using crypt comparison
      const { data: verifyResult, error: verifyError } = await supabase
        .rpc("verify_password", {
          input_password: password,
          stored_hash: settings.admin_password_hash,
        });

      if (verifyError || !verifyResult) {
        return new Response(JSON.stringify({ error: "รหัสผ่านไม่ถูกต้อง" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Generate a simple session token (timestamp-based, valid for 2 hours)
      const token = btoa(`${Date.now()}:${Date.now() + 7200000}`);
      return new Response(JSON.stringify({ token, message: "เข้าสู่ระบบสำเร็จ" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === GET MESSAGES: fetch all messages for president ===
    if (path === "/messages" && req.method === "POST") {
      const { token } = body;
      if (!token) {
        return new Response(JSON.stringify({ error: "ไม่ได้เข้าสู่ระบบ" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify token
      try {
        const decoded = atob(token);
        const expiry = parseInt(decoded.split(":")[1]);
        if (Date.now() > expiry) {
          return new Response(JSON.stringify({ error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        return new Response(JSON.stringify({ error: "โทเค็นไม่ถูกต้อง" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: messages, error: messagesError } = await supabase
        .from("club_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (messagesError) {
        return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ messages }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === REPLY: post a reply to a message ===
    if (path === "/reply" && req.method === "POST") {
      const { token, messageId, replyText, makePublic } = body;
      if (!token) {
        return new Response(JSON.stringify({ error: "ไม่ได้เข้าสู่ระบบ" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify token
      try {
        const decoded = atob(token);
        const expiry = parseInt(decoded.split(":")[1]);
        if (Date.now() > expiry) {
          return new Response(JSON.stringify({ error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        return new Response(JSON.stringify({ error: "โทเค็นไม่ถูกต้อง" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!messageId || !replyText) {
        return new Response(JSON.stringify({ error: "ข้อมูลไม่ครบถ้วน" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: updated, error: updateError } = await supabase
        .from("club_messages")
        .update({
          reply: replyText,
          replied_at: new Date().toISOString(),
          status: "answered",
          is_public: !!makePublic,
        })
        .eq("id", messageId)
        .select()
        .maybeSingle();

      if (updateError) {
        return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาดในการบันทึกคำตอบ" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ message: "ตอบกลับสำเร็จ", data: updated }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === CHANGE PASSWORD ===
    if (path === "/change-password" && req.method === "POST") {
      const { token, oldPassword, newPassword } = body;
      if (!token) {
        return new Response(JSON.stringify({ error: "ไม่ได้เข้าสู่ระบบ" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify token
      try {
        const decoded = atob(token);
        const expiry = parseInt(decoded.split(":")[1]);
        if (Date.now() > expiry) {
          return new Response(JSON.stringify({ error: "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        return new Response(JSON.stringify({ error: "โทเค็นไม่ถูกต้อง" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify old password
      const { data: settings } = await supabase
        .from("club_settings")
        .select("admin_password_hash")
        .eq("id", 1)
        .maybeSingle();

      const { data: verifyResult } = await supabase
        .rpc("verify_password", {
          input_password: oldPassword,
          stored_hash: settings.admin_password_hash,
        });

      if (!verifyResult) {
        return new Response(JSON.stringify({ error: "รหัสผ่านเดิมไม่ถูกต้อง" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Hash new password
      const { data: newHash } = await supabase
        .rpc("hash_password", { input_password: newPassword });

      if (!newHash) {
        return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาดในการเข้ารหัส" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await supabase
        .from("club_settings")
        .update({ admin_password_hash: newHash, updated_at: new Date().toISOString() })
        .eq("id", 1);

      return new Response(JSON.stringify({ message: "เปลี่ยนรหัสผ่านสำเร็จ" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === DELETE MESSAGE ===
    if (path === "/delete-message" && req.method === "POST") {
      const { token, messageId } = body;
      if (!token) {
        return new Response(JSON.stringify({ error: "ไม่ได้เข้าสู่ระบบ" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      try {
        const decoded = atob(token);
        const expiry = parseInt(decoded.split(":")[1]);
        if (Date.now() > expiry) {
          return new Response(JSON.stringify({ error: "เซสชันหมดอายุ" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        return new Response(JSON.stringify({ error: "โทเค็นไม่ถูกต้อง" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: deleteError } = await supabase
        .from("club_messages")
        .delete()
        .eq("id", messageId);

      if (deleteError) {
        return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาดในการลบ" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ message: "ลบข้อความสำเร็จ" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === GET ANNOUNCEMENTS: public, no token needed ===
    if (path === "/announcements" && req.method === "GET") {
      const { data: announcements, error: annError } = await supabase
        .from("club_announcements")
        .select("*")
        .eq("is_active", true)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (annError) {
        return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ announcements }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === CREATE ANNOUNCEMENT ===
    if (path === "/announcements/create" && req.method === "POST") {
      const { token, title, body: annBody, isPinned } = body;
      if (!token) {
        return new Response(JSON.stringify({ error: "ไม่ได้เข้าสู่ระบบ" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      try {
        const decoded = atob(token);
        const expiry = parseInt(decoded.split(":")[1]);
        if (Date.now() > expiry) {
          return new Response(JSON.stringify({ error: "เซสชันหมดอายุ" }), {
            status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        return new Response(JSON.stringify({ error: "โทเค็นไม่ถูกต้อง" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!title || !annBody) {
        return new Response(JSON.stringify({ error: "กรุณากรอกหัวข้อและเนื้อหา" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: ann, error: annErr } = await supabase
        .from("club_announcements")
        .insert({ title, body: annBody, is_pinned: !!isPinned })
        .select()
        .maybeSingle();

      if (annErr) {
        return new Response(JSON.stringify({ error: "สร้างประกาศไม่สำเร็จ" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ message: "สร้างประกาศสำเร็จ", data: ann }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === UPDATE ANNOUNCEMENT ===
    if (path === "/announcements/update" && req.method === "POST") {
      const { token, annId, title, body: annBody, isPinned, isActive } = body;
      if (!token) {
        return new Response(JSON.stringify({ error: "ไม่ได้เข้าสู่ระบบ" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      try {
        const decoded = atob(token);
        const expiry = parseInt(decoded.split(":")[1]);
        if (Date.now() > expiry) {
          return new Response(JSON.stringify({ error: "เซสชันหมดอายุ" }), {
            status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        return new Response(JSON.stringify({ error: "โทเค็นไม่ถูกต้อง" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (title !== undefined) updateData.title = title;
      if (annBody !== undefined) updateData.body = annBody;
      if (isPinned !== undefined) updateData.is_pinned = isPinned;
      if (isActive !== undefined) updateData.is_active = isActive;

      const { error: updErr } = await supabase
        .from("club_announcements")
        .update(updateData)
        .eq("id", annId);

      if (updErr) {
        return new Response(JSON.stringify({ error: "แก้ไขไม่สำเร็จ" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ message: "แก้ไขสำเร็จ" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === DELETE ANNOUNCEMENT ===
    if (path === "/announcements/delete" && req.method === "POST") {
      const { token, annId } = body;
      if (!token) {
        return new Response(JSON.stringify({ error: "ไม่ได้เข้าสู่ระบบ" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      try {
        const decoded = atob(token);
        const expiry = parseInt(decoded.split(":")[1]);
        if (Date.now() > expiry) {
          return new Response(JSON.stringify({ error: "เซสชันหมดอายุ" }), {
            status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        return new Response(JSON.stringify({ error: "โทเค็นไม่ถูกต้อง" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: delErr } = await supabase
        .from("club_announcements")
        .delete()
        .eq("id", annId);

      if (delErr) {
        return new Response(JSON.stringify({ error: "ลบไม่สำเร็จ" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ message: "ลบประกาศสำเร็จ" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === PENDING COUNT: for notification badge ===
    if (path === "/pending-count" && req.method === "GET") {
      const { count, error: countErr } = await supabase
        .from("club_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (countErr) {
        return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาด" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ count: count || 0 }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "ไม่พบเส้นทางที่ระบุ" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
