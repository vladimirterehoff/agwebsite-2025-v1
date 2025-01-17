// Libs
import React, { ReactNode } from "react";
// MUI Components
import Link from "next/link";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import PlusCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// Components
import BreadCrumbs from "@/components/Common/BreadCrumbs";
// Styles
import styles from "./style.module.scss";
import { Box } from "@mui/material";
import router from "next/router";

interface HeaderProps {
  title?: string;
  className?: string;
  id?: number | string;
  modelName?: string;
  breadcrumbs?: any;
  urlSlug?: string;
  needAddLink?: boolean;
  needBackLink?: boolean;
  children?: ReactNode;
}

/**
 * Content Header Component
 * @param props
 * @constructor
 */
const Index = (props: HeaderProps) => {
  return (
    <Grid
      container
      // spacing={3}
      justifyContent={"space-between"}
      className={`${styles.header} ${props.className || ""}`}
    >
      <Grid item>
        {/*BREADCRUMBS*/}
        {props.breadcrumbs && (
          <BreadCrumbs className="breadcrumbs" items={[...props.breadcrumbs]} />
        )}

        {/*TITLE*/}
        <Typography variant="h3" color="textPrimary">
          {props.title
            ? `${props.title}`
            : props.id
            ? `Edit ${props.modelName}`
            : `Add New ${props.modelName}`}
        </Typography>
      </Grid>

      <Grid
        item
        alignItems={"flex-end"}
        display={"flex"}
        gap={0}
        flexDirection={"column"}
      >
        <Box>
          {props.needAddLink && props.urlSlug && (
            <Link href={`${props.urlSlug}/add`}>
              <Button
                color="primary"
                variant="contained"
                className={styles.action}
                startIcon={
                  <SvgIcon fontSize="small">
                    <PlusCircleIcon />
                  </SvgIcon>
                }
              >
                Add New
              </Button>
            </Link>
          )}
          {props.needBackLink &&
            (props.urlSlug ? (
              <Link href={`${props.urlSlug}`}>
                <Button
                  className={styles.action}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <ArrowBackIcon />
                    </SvgIcon>
                  }
                >
                  Back
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => router.back()}
                className={styles.action}
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowBackIcon />
                  </SvgIcon>
                }
              >
                Back
              </Button>
            ))}
        </Box>

        {props.children}
      </Grid>
    </Grid>
  );
};

export default Index;
