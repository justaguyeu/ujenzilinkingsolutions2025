import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const MAX_PX = 800;

export const resizeAndEncode = (file) =>
  new Promise((resolve, reject) => {
    if (file.size / 1024 / 1024 > 10) {
      reject(new Error("Image too large (max 10 MB)."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Invalid image."));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_PX || height > MAX_PX) {
          if (width > height) {
            height = Math.round((height * MAX_PX) / width);
            width = MAX_PX;
          } else {
            width = Math.round((width * MAX_PX) / height);
            height = MAX_PX;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

const useRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("name", { ascending: true });
    if (!error && data) setRegistrations(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const channelName = `registrations-${Math.random()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "registrations" },
        fetchAll
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  const getForCategory = useCallback(
    (categoryId) => registrations.filter((r) => r.category_id === categoryId),
    [registrations]
  );

  const addRegistration = useCallback(async (data) => {
    const { data: inserted, error } = await supabase
      .from("registrations")
      .insert([
        {
          category_id: data.categoryId,
          name: data.name,
          description: data.description || null,
          phone: data.phone,
          website: data.website || null,
          location: data.location || null,
          instagram: data.instagram || null,
          logo: data.logo || null,
          logo2: data.logo2 || null,
          logo3: data.logo3 || null,
        },
      ])
      .select()
      .single();

    if (!error) await fetchAll(); // ← refetch immediately after insert

    return { data: inserted, error };
  }, [fetchAll]); // ← add fetchAll to deps

  const deleteRegistration = useCallback(async (id) => {
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", id);
    return { error };
  }, []);

  return {
    registrations,
    loading,
    getForCategory,
    addRegistration,
    deleteRegistration,
  };
};

export default useRegistrations;