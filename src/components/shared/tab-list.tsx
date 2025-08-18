import { useSearchParams } from "react-router-dom";

import { ITab } from "@/helpers/interfaces";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui";

interface TabListProps {
  tabs: ITab[];
  defaultTab: string;
}

const TabList = ({ defaultTab, tabs = [] }: TabListProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <Tabs className="tab" defaultValue={searchParams.get("tab") ?? defaultTab ?? tabs[0]?.value}>
        <TabsList>
          {tabs.map(tab =>
            !tab.inactive ? (
              <TabsTrigger
                className="cursor-pointer"
                key={tab.value}
                value={tab.value}
                onClick={() => setSearchParams({ tab: tab.value })}
              >
                {tab.label}
              </TabsTrigger>
            ) : null
          )}
        </TabsList>

        {tabs.map(tab =>
          !tab.inactive ? (
            <TabsContent className="space-y-4" key={tab.value} value={tab.value}>
              {(tab.components || []).map((Component, idx) => (
                <Component key={idx} />
              ))}
            </TabsContent>
          ) : null
        )}
      </Tabs>
    </>
  );
};

export default TabList;
