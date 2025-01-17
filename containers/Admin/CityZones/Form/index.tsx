// Libs
import React, {ChangeEvent, useEffect, useMemo, useState} from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";

// Redux
import { AppState } from "@/app-redux/state";
import { MultiLangString } from "@/app-redux/COMMON/model/multilang";
// MUI Components
import Box from "@mui/material/Box";
import {Divider} from "@mui/material";
// Components
import MapWithPolygon from "./Components/MapWithPolygon";
import Loader from "@/components/Common/Loader";
import ContentHeader from "@/components/Admin/ContentHeader";
import CRUDNotFound from "@/components/Admin/Crud/NotFound";
import FormButtons from "@/components/Common/FormComponents/FormButtons";
// Hooks
import { useCrudForm } from "@/hooks/crud/useCrudForm";
// Utils
import { ADMIN_PATH, ADMIN_MAIN } from "@/utils/routers/admin";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import LangTextfield from "@/components/Common/Lang/LangTextfield";
import Select from "@/components/Common/FormComponents/Select";
import {citiesActions} from "@/app-redux/cities/actions";
import {cityZonesActions} from "@/app-redux/cityZones/actions";
import {Coordinates} from "@/app-redux/COMMON/model/coordinates";
import ColorPicker from "@/components/Site/ColorPicker";
import Typography from "@mui/material/Typography";
import {FilterService} from "@/helpers/filterService";

interface Props {
  id?: string;
}

export interface FormValues {
  id: number;
  non_field_error: string;
  name: MultiLangString;
  city_id: { id: string; name: string };
  polygon: Coordinates[];
}

/**
 * Form Container
 * @param props
 */
const CityZonesForm = (props: Props) => {
  // Store
  const { loading, data, list: cityZoneList } = useSelector((state: AppState) => state.cityZones);

  // Hooks
  const formHook = useForm<FormValues>({});
  const { handleSubmit, formState } = formHook;
  const { errors } = formState;

  const { list: cities } = useSelector((state: AppState) => state.cities);
  const [ polygon, setPolygon ] = useState<Coordinates[]|undefined>();
  const [ city, setCity ] = useState<any>();
  const [ color, setColor ] = useState<string|undefined>('#2196F3');

  const isEdit = useMemo(() => Boolean(props.id), [props.id]);
  const cityVariants = useMemo(() => {
    const cityArray= [...cities]
    return cityArray.reduce((acc: any[], city) => {
      return [...acc, { id: city.id, name: city.name.en }];
    }, []);
  }, [cities]);

  const { getData, onSubmit, filter } = useCrudForm<FormValues>(
    cityZonesActions,
    formHook,
    ADMIN_PATH.CITY_ZONES,
    (data) => {
      const { relations, ...otherData } = data;
      return {
        ...otherData,
        city_id: data.city_id
          ? cityVariants.find((i) => i.id === data.city_id)
          : undefined,
      };
    }
  );

  const onSubmitAction = async (formData: FormValues) => {
    const newFormData: any = { ...formData };

    newFormData.city_id = city?.id;
    newFormData.polygon = polygon;
    newFormData.color = color;

    try {
      await onSubmit(newFormData);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (props.id && cities.length > 0) {
      getData(Number(props.id));
    }
  }, [props.id, cities]);

  useEffect(() => {
      setPolygon(data?.polygon);
      setCity(cityVariants.find(city => city.id === data?.city_id));

      if (data?.color) {
        setColor(data?.color);
      }

  }, [data?.polygon]);

  useEffect(() => {
    if (city) {
      const filter = new FilterService();
      filter.builder.equal('city_id', city.id);

      if (props.id) {
        filter.builder.not('id', props.id);
      }

      cityZonesActions.get(undefined, filter.filter);
    }
  }, [city]);

  useEffect(() => {
    if (!cities?.length) citiesActions.get(undefined, "limit=100");

    return () => {
      cityZonesActions.clearData();
    };
  }, []);

  return (
    <>
      <div>
        <ContentHeader
          id={props.id}
          needBackLink={true}
          modelName="cityZones"
          urlSlug={ADMIN_PATH.CITY_ZONES}
          breadcrumbs={[
            { url: ADMIN_MAIN, text: "Dashboard" },
            { url: ADMIN_PATH.CITY_ZONES, text: "City zones" },
            { url: false, text: props.id ? "Edit" : "Add" },
          ]}
        />

        <Loader isLoading={loading} />
        <CRUDNotFound loading={loading} data={data} id={props.id} />

        {((props.id && data) || !props.id) && (
          <FormProvider {...formHook}>
            <form
              onSubmit={handleSubmit(onSubmitAction)}
              noValidate
              autoComplete="new-password"
            >
              <Box mb={2}>
                  <Card className="relative">
                    <Box p={2}>
                      <Grid container spacing={2} rowGap={3} mb={4} maxWidth={800} pt={2}>
                        <Grid item xs={12}>
                          <LangTextfield name="name" label={"Name"} errors={errors?.name} langRequired={['en']} />
                        </Grid>

                        <Grid item xs={12}>
                          <Select
                            name={"city_id"}
                            label={"City"}
                            variants={cityVariants}
                            value={city}
                            error={Boolean(errors.city_id?.message)}
                            helperText={errors.city_id?.message}
                            onChange={(e: ChangeEvent<{}>, newValue: any) => setCity(newValue)}
                            required
                            disabled={isEdit}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography fontSize={14}>Color setting:</Typography>
                            <ColorPicker handleColorChange={(color: string) => setColor(color)} color={color}/>
                        </Grid>

                        <Grid item xs={12} style={{height: 500}}>
                          {
                            ((!isEdit || (isEdit && data?.id)) && color && !loading) &&
                            <MapWithPolygon
                                  setPolygon={setPolygon}
                                  polygon={data?.polygon}
                                  cityName={city?.name}
                                  color={color}
                                  cityZoneList={cityZoneList}
                              />
                          }
                        </Grid>
                      </Grid>
                    </Box>
                  </Card>

                  {errors["non_field_error"] && (
                    <Box className="error-text" mb={2}>
                      {errors["non_field_error"]?.message}
                    </Box>
                  )}
                </Box>

              {errors["non_field_error"] && (
                <div className="error-text">
                  {errors["non_field_error"]?.message}
                </div>
              )}

              <FormButtons cancelUrl={ADMIN_PATH.CITY_ZONES} />
            </form>
          </FormProvider>
        )}
      </div>
    </>
  );
};

export default CityZonesForm;
