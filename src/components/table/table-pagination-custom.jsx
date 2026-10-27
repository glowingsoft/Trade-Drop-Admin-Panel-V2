import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import TablePagination from '@mui/material/TablePagination';
import FormControlLabel from '@mui/material/FormControlLabel';


export function TablePaginationCustom({
  sx,
  dense,
  onChangeDense,
  rowsPerPageOptions = [2, 5, 10, 25],
  ...other
}) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        {...other}
        sx={{
          borderTopColor: 'transparent',
          '& .MuiTablePagination-toolbar': {
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-end' },
            px: { xs: 1, sm: 2 },
          },
          '& .MuiTablePagination-spacer': {
            display: { xs: 'none', sm: 'block' },
          },
        }}
      />

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch name="dense" checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: { sm: 'absolute' },
          }}
        />
      )}
    </Box>
  );
}
