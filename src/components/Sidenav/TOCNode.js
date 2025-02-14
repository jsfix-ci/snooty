import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { cx, css as LeafyCSS } from '@leafygreen-ui/emotion';
import { SideNavItem } from '@leafygreen-ui/side-nav';
import { palette } from '@leafygreen-ui/palette';
import Box from '@leafygreen-ui/box';
import Icon from '@leafygreen-ui/icon';
import { theme } from '../../theme/docsTheme';
import { sideNavItemTOCStyling } from './styles/sideNavItem';
import Link from '../Link';
import { formatText } from '../../utils/format-text';
import { isActiveTocNode } from '../../utils/is-active-toc-node';
import { isSelectedTocNode } from '../../utils/is-selected-toc-node';
import SyncCloud from '../SyncCloud';
import VersionSelector from './VersionSelector';

// Toctree nodes begin at level 1 (i.e. toctree-l1) for top-level sections and increase
// with recursive depth
const BASE_NODE_LEVEL = 1;

const caretStyle = LeafyCSS`
  margin-top: 3px;
  margin-right: 5px;
  min-width: 16px;
`;

const wrapperStyle = LeafyCSS`
  display: flex;
  align-items: center;
  padding-right: ${theme.size.medium};

  &:hover {
    background: ${palette.gray.light2};
  }

  > li {
    flex: 1 1 auto;
  }
`;
/**
 *
 * @param {hasVersions} boolean
 * @returns Wrapper for Version Selector, or returns children
 */
const Wrapper = ({ children, hasVersions }) => {
  return hasVersions ? <Box className={cx(wrapperStyle)}>{children}</Box> : <>{children}</>;
};

/**
 * Potential leaf node for the Table of Contents. May have children which are also
 * recursively TOCNodes.
 */
const TOCNode = ({ activeSection, handleClick, level = BASE_NODE_LEVEL, node }) => {
  const { title, slug, url, children, options = {} } = node;
  const target = slug || url;
  const hasChildren = !!children.length;
  const hasVersions = !!(options?.versions?.length > 1); // in the event there is only one version, do we show version selector?
  const isActive = isActiveTocNode(activeSection, slug, children);
  const isSelected = isSelectedTocNode(activeSection, slug);
  const isDrawer = !!(options && options.drawer);
  const isTocIcon = !!(options.tocicon === 'sync');
  const [isOpen, setIsOpen] = useState(isActive);

  // If the active state of this node changes, change the open state to reflect it
  // Disable linter to handle conditional dependency that allows drawers to close when a new page is loaded
  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive, isDrawer || hasChildren ? activeSection : null]); // eslint-disable-line react-hooks/exhaustive-deps

  const NodeLink = () => {
    // If title is a plaintext string, render as-is. Otherwise, iterate over the text nodes to properly format titles.
    const formatTextOptions = {
      literalEnableInline: true,
    };
    // Wrap title in a div to prevent SideNavItem from awkwardly spacing titles with nested elements (e.g. code tags)
    const formattedTitle = (
      <div
        css={css`
          margin-left: ${hasChildren || isTocIcon ? '0px' : '21px'};
          color: ${isActive ? `${palette.green.dark3};` : `${palette.gray.dark3};`};
        `}
      >
        {formatText(title, formatTextOptions)}
      </div>
    );

    const iconType = isOpen ? 'CaretDown' : 'CaretRight';

    if (isDrawer && hasChildren) {
      return (
        <SideNavItem
          className={cx(sideNavItemTOCStyling({ level }))}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <Icon className={cx(caretStyle)} glyph={iconType} fill={palette.gray.base} />
          {isTocIcon && <SyncCloud />}
          {formattedTitle}
        </SideNavItem>
      );
    }
    return (
      <Wrapper hasVersions={hasVersions}>
        <SideNavItem
          as={Link}
          to={target}
          active={isSelected}
          className={cx(sideNavItemTOCStyling({ level }))}
          onClick={(e) => {
            setIsOpen(!isOpen);
          }}
        >
          {hasChildren && <Icon className={cx(caretStyle)} glyph={iconType} fill={palette.gray.base} />}
          {isTocIcon && <SyncCloud />}
          {formattedTitle}
        </SideNavItem>
        {hasVersions && <VersionSelector versionedProject={options.project} />}
      </Wrapper>
    );
  };

  return (
    <>
      <NodeLink />
      {isOpen &&
        children.map((c) => {
          const key = c.slug || c.url;
          return (
            <TOCNode activeSection={activeSection} handleClick={handleClick} node={c} level={level + 1} key={key} />
          );
        })}
    </>
  );
};

TOCNode.propTypes = {
  level: PropTypes.number,
  node: PropTypes.shape({
    children: PropTypes.array.isRequired,
    options: PropTypes.shape({
      drawer: PropTypes.bool,
      tocicon: PropTypes.bool,
      styles: PropTypes.objectOf(PropTypes.string),
    }),
    slug: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string]).isRequired,
    url: PropTypes.string,
  }).isRequired,
};

TOCNode.defaultProps = {
  level: BASE_NODE_LEVEL,
};

export default TOCNode;
