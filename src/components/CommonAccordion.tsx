import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionDetailsProps,
  AccordionProps,
  AccordionSummary,
  AccordionSummaryProps,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { PropsWithChildren } from 'react';
import { usePaletteMode } from '../../contexts/PaletteModeContext';

type CommonAccordionProps = PropsWithChildren & {
  title: string;
  accordionProps?: Omit<AccordionProps, 'children'>;
  accordionSummaryProps?: AccordionSummaryProps;
  accordionDetailsProps?: AccordionDetailsProps;
};
export default function CommonAccordion({
  title,
  children,
  accordionProps,
  accordionDetailsProps,
  accordionSummaryProps,
}: CommonAccordionProps) {
  const { mode } = usePaletteMode();

  return (
    <Accordion {...accordionProps}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: mode === 'light' ? grey[300] : grey[800],
        }}
        {...accordionSummaryProps}
      >
        {title}
      </AccordionSummary>
      <AccordionDetails {...accordionDetailsProps}>{children}</AccordionDetails>
    </Accordion>
  );
}
