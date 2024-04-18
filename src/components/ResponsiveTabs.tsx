import { FormControl, MenuItem, Select, Tab, Tabs } from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useDeviceFeatures } from '../hooks';

type ResponsiveTabsProps = PropsWithChildren & {
  titles: string[];
  onTabChange: (idx: number) => void;
};

export default function ResponsiveTabs({ titles, onTabChange, children }: ResponsiveTabsProps) {
  const [tabIdx, setTabIdx] = useState(0);
  const { isMobile } = useDeviceFeatures();

  useEffect(() => {
    onTabChange(tabIdx);
  }, [tabIdx]);

  return (
    <>
      {isMobile ? (
        <FormControl fullWidth>
          <Select
            value={tabIdx}
            onChange={(event) => {
              setTabIdx(event.target.value as number);
            }}
          >
            {titles.map((title, idx) => {
              return (
                <MenuItem key={idx} value={idx}>
                  {title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      ) : (
        <Tabs value={tabIdx} onChange={(_, newTab) => setTabIdx(newTab)}>
          {titles.map((title, idx) => {
            return <Tab key={idx} label={title} />;
          })}
        </Tabs>
      )}
      {children}
    </>
  );
}
