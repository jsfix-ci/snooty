import { css } from '@emotion/react';
import { palette } from '@leafygreen-ui/palette';
import { theme } from '../../../theme/docsTheme';

export const baseCodeStyle = css`
  display: table;
  margin: ${theme.size.medium} 0;
  min-width: 150px;
  table-layout: fixed;
  width: 100%;

  // Override default LG Code language switcher font size
  button > div > div {
    font-size: ${theme.fontSize.small};
  }
`;

export const borderCodeStyle = css`
  border: 1px solid ${palette.gray.light2};
`;
