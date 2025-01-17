import {useSelector} from "react-redux";
import {AppState} from "@/app-redux/state";
import React, {useEffect, useState} from "react";
import {contactUsActions} from "@/app-redux/contactUs/actions";
import {FilterService} from "@/helpers/filterService";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import Button from "@mui/material/Button";
import moment from "moment/moment";
import {ADMIN_PATH} from "@/utils/routers/admin";
import Loader from "@/components/Common/Loader";

export function CustomerFeedback() {
  const {loading, error, list} = useSelector((state: AppState) => state.contactUs);

  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleDescription = (id: number) => {
    setExpanded((prev) => ({...prev, [id]: !prev[id]}));
  };

  const getTruncatedText = (text: string, isExpanded: boolean) => {
    if (isExpanded || text.length <= 70) return text;
    return `${text.substring(0, 70)}...`;
  };

  useEffect(() => {
    const filter = new FilterService();
    filter.limit(20);
    filter.sort('-id');
    filter.expand(['user']);
    contactUsActions.get(undefined, filter.filter);
  }, []);

  return (
    <Box sx={{maxWidth: 600, margin: '0 auto', padding: 2}}>
      <Loader isLoading={loading}/>
      <Typography variant="h6" gutterBottom>
        Customer’s Feedback
      </Typography>
      <List>
        {list.map((feedback) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box>
                    {
                      feedback.relations?.user
                        ? <Link href={`${ADMIN_PATH.USERS}/${feedback.user_id}/view`}>
                          {feedback.relations?.user?.full_name}
                        </Link>
                        : 'Deleted User'
                    }
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                      sx={{marginLeft: 1}}
                    >
                      <Link
                        href={`mailto:${feedback.email}`}
                        underline="hover"
                      >
                        {feedback.email}
                      </Link>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                      sx={{marginLeft: 1}}
                    >
                      {moment(feedback.created_at).format(
                        "YYYY.MM.DD HH:mm"
                      )}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      <strong>Type:</strong> {feedback.type}
                    </Typography>
                    <br/>
                    <Typography component="span" variant="body2">
                      {getTruncatedText(
                        feedback.description,
                        expanded[feedback.id]
                      )}
                    </Typography><br/>
                    {feedback.description.length > 100 && (
                      <Button
                        size="small"
                        onClick={() => toggleDescription(feedback.id)}
                        sx={{textTransform: 'none', marginTop: 1}}
                      >
                        {expanded[feedback.id] ? 'Hide Description' : 'Show More'}
                      </Button>
                    )}
                  </>
                }
              />
            </ListItem>
            <Divider component="li"/>
          </>
        ))}
      </List>
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        <Link
          href={`${ADMIN_PATH.CONTACT_US}`}
          target={'_blank'}
          color="primary"
          underline="hover"
          sx={{ fontWeight: 'bold' }}
        >
          See All Feedback
        </Link>
      </Box>
    </Box>
  );
}
