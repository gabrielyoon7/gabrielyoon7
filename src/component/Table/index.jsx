// @/src/components/Table/index.jsx
import React, { useState } from "react";

import useTable from "../../hooks/useTable";
import styles from "./Table.module.css";
import TableFooter from "./TableFooter";

const Table = ({ data, rowsPerPage }) => {
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  return (
    <>
      <table className={styles.table}>
        <thead className={styles.tableRowHeader}>
          <tr>
            <th className={styles.tableHeader}>학기</th>
            <th className={styles.tableHeader}>학수코드</th>
            <th className={styles.tableHeader}>교과목명</th>
            <th className={styles.tableHeader}>이수구분</th>
            <th className={styles.tableHeader}>인증구분</th>
            <th className={styles.tableHeader}>학점</th>
            <th className={styles.tableHeader}>설계학점</th>
            <th className={styles.tableHeader}>등급</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((el) => (
            <tr className={styles.tableRowItems} key={el.id}>
              <td className={styles.tableCell}>{el.year}</td>
              <td className={styles.tableCell}>{el.id}</td>
              <td className={styles.tableCell}>{el.title}</td>
              <td className={styles.tableCell}>{el.type1}</td>
              <td className={styles.tableCell}>{el.type2}</td>
              <td className={styles.tableCell}>{el.point}</td>
              <td className={styles.tableCell}>{el.design_point}</td>
              <td className={styles.tableCell}>{el.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </>
  );
};

export default Table;