"use client";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Loading from "@/app/loading";
import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api/clientApi";
import { Note } from "@/types/note";
import css from "./Notesclient.module.css";

interface NotesClientProps {
  initialData: { notes: Note[]; totalPages: number };
  initialTag: string | undefined;
}

export default function NotesClient({
  initialData,
  initialTag,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [tag, setTag] = useState(initialTag);

  useEffect(() => {
    setTag(initialTag);
    setCurrentPage(1);
  }, [initialTag]);

  const { data, isError, isLoading, isSuccess, isFetching } = useQuery({
    queryKey: ["notes", debouncedQuery, currentPage, tag],
    queryFn: () => fetchNotes(debouncedQuery, currentPage, tag),
    placeholderData: keepPreviousData,
    initialData,
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleChange = useCallback((val: string) => {
    setQuery(val);
    setCurrentPage(1);
  }, []);

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <div className={css.searchWrap}>
          <SearchBox value={query} onChange={handleChange} />
        </div>
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {isLoading && !data?.notes && <Loading />}
      {isError && <ErrorMessage />}

      {isSuccess && data?.notes.length > 0 && (
        <div className={css.noteListWrapper}>
          <NoteList notes={data.notes} />

          {isFetching && !isLoading && (
            <div className={css.overlayLoader}>
              <Loading />
            </div>
          )}
        </div>
      )}

      {isSuccess && totalPages > 1 && (
        <div className={css.paginationWrapper}>
          <Pagination
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
}
