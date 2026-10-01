import { m } from "framer-motion";
import PropTypes from "prop-types";
// @mui
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";
// theme
// import { bgGradient } from "src/theme/css";
// components
import { MotionContainer, varFade } from "src/components/animate";
import { CONFIG } from "src/config-global";
import { bgGradient } from "src/theme/styles";


export function FaqsHero({ data }) {


  const theme = useTheme();

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, pb: 3, pt: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.grey[900], 0.8),
            imgUrl: `${CONFIG.site.basePath}/assets/images/faqs/hero.jpg`,
          }),
          height: { md: 300 },
          py: { xs: 10, md: 0 },
          borderRadius: ".7rem .7rem .7rem .7rem",
          overflow: "hidden",
          position: "relative",
          backgroundPosition: 'end',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Container
          maxWidth={false}
          component={MotionContainer}>
          <Box
            sx={{
              bottom: { md: 30 },
              left: { md: '40px' },
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