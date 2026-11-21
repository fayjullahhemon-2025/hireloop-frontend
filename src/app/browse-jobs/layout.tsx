import { Toaster } from "@/components/ui/toast";

const BrowseJobsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default BrowseJobsLayout;
