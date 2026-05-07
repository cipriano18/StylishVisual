/**
 * Returns the pagination buttons to display around the current page.
 * @param {number} currentPage
 * @param {number} totalPages
 * @returns {(number | string)[]}
 */
export const getPageNumbers = (currentPage, totalPages) => {
  const delta = 1;
  const pages = [];

  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push("...");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
};
