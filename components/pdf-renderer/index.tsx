"use client";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "../ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import SimpleBar from "simplebar-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PdfRenderer = ({ url }: { url: string }) => {
  const { toast } = useToast();
  const { width, ref } = useResizeDetector();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState<number>(1);
  const customPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });
  type TCustomPageValidator = z.infer<typeof customPageValidator>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(customPageValidator),
  });
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
            }}
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit((data) => {
                    setCurrentPage(Number(data.page));
                    setValue("page", String(data.page));
                  })();
                }
              }}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>
          <Button
            disabled={currentPage === numPages || numPages === undefined}
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > numPages! ? numPages! : prev + 1
              );
            }}
            variant="ghost"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" aria-label="zoom" variant="ghost">
                <Search className="w-4 h-4" />
                {scale * 100}% <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={(error) => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later.",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              file={`https://utfs.io/f/${url}`}
              className="max-h-full"
            >
              <Page
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
