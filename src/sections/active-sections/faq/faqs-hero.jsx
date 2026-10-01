import PropTypes from "prop-types";
import { m } from "framer-motion";
// @mui
import { alpha, useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
// theme
import { bgGradient } from "src/theme/css";
// components
import { MotionContainer, varFade } from "src/components/animate";


export default function FaqsHero({ data }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.grey[900], 0.8),
          imgUrl: "/assets/images/faqs/hero.jpg",
        }),
        height: { md: 300 },
        py: { xs: 10, md: 0 },
        borderRadius: ".7rem .7rem .7rem .7rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Container sx={{marginLeft : '3rem'}} component={MotionContainer}>
        <Box
          sx={{
            bottom: { md: 30 },
            position: { md: "absolute" },
            textAlign: { xs: "center", md: "unset" },
          }}
        >
          <div>
            <br />

            <Stack
              spacing={2}
              display="inline-flex"
              direction="row"
              sx={{ color: "common.white" }}
            >
              <TextAnimate text={data} />
            </Stack>
          </div>
        </Box>
      </Container>
    </Box>
  );
}

function TextAnimate({ text, variants, sx, ...other }) {
  return (
    <Box
      component={m.div}
      sx={{
        typography: "h1",
        overflow: "hidden",
        display: "inline-flex",
        ...sx,
      }}
      {...other}
    >
      {text?.split("").map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp} style={{ whiteSpace: 'pre' }}>
          {letter}
        </m.span>
      ))}
    </Box>
  );
}

TextAnimate.propTypes = {
  sx: PropTypes.object,
  text: PropTypes.string,
  variants: PropTypes.object,
};