import { inputBaseClasses } from '@mui/material/InputBase';
import { filledInputClasses } from '@mui/material/FilledInput';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';

import { varAlpha } from '../../styles';


const MuiInputBase = {
  styleOverrides: {
    root: ({ theme }) => ({
      [`&.${inputBaseClasses.disabled}`]: {
        '& svg': { color: theme.vars.palette.text.disabled },
      },
    }),
    input: ({ theme }) => {
      const autofill = {
        WebkitBoxShadow: `0 0 0 1000px ${theme.vars.palette.background.paper} inset !important`,
        boxShadow: `0 0 0 1000px ${theme.vars.palette.background.paper} inset !important`,
        WebkitTextFillColor: `${theme.vars.palette.text.primary} !important`,
        caretColor: `${theme.vars.palette.text.primary} !important`,
        backgroundColor: `${theme.vars.palette.background.paper} !important`,
        backgroundImage: 'none !important',
        borderRadius: 'inherit',
        transition: 'background-color 9999s ease-out 0s',
      };

      return {
        fontSize: theme.typography.pxToRem(15),
        [theme.breakpoints.down('sm')]: {
          fontSize: theme.typography.pxToRem(16),
        },
        '&::placeholder': {
          opacity: 1,
          color: theme.vars.palette.text.disabled,
        },
        '&:-webkit-autofill': autofill,
        '&:-webkit-autofill:hover': autofill,
        '&:-webkit-autofill:focus': autofill,
        '&:-webkit-autofill:active': autofill,
      };
    },
  },
};


const MuiInput = {
  styleOverrides: {
    underline: ({ theme }) => ({
      '&::before': { borderBottomColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.32) },
      '&::after': { borderBottomColor: theme.vars.palette.text.primary },
    }),
  },
};


const MuiOutlinedInput = {
  styleOverrides: {
    root: ({ theme }) => ({
      [`&.${outlinedInputClasses.focused}`]: {
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: theme.vars.palette.text.primary,
        },
      },
      [`&.${outlinedInputClasses.error}`]: {
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: theme.vars.palette.error.main,
        },
      },
      [`&.${outlinedInputClasses.disabled}`]: {
        [`& .${outlinedInputClasses.notchedOutline}`]: {
          borderColor: theme.vars.palette.action.disabledBackground,
        },
      },
    }),
    notchedOutline: ({ theme }) => ({
      borderColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.2),
      transition: theme.transitions.create(['border-color'], {
        duration: theme.transitions.duration.shortest,
      }),
    }),
  },
};


const MuiFilledInput = {

  defaultProps: { disableUnderline: true },

  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius,
      backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
      '&:hover': { backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16) },
      [`&.${filledInputClasses.focused}`]: {
        backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
      },
      [`&.${filledInputClasses.error}`]: {
        backgroundColor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
        [`&.${filledInputClasses.focused}`]: {
          backgroundColor: varAlpha(theme.vars.palette.error.mainChannel, 0.16),
        },
      },
      [`&.${filledInputClasses.disabled}`]: {
        backgroundColor: theme.vars.palette.action.disabledBackground,
      },
    }),
  },
};


export const textfield = {
  MuiInput,
  MuiInputBase,
  MuiFilledInput,
  MuiOutlinedInput,
};
