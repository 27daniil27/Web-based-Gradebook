import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import BuildIcon from '@mui/icons-material/Build';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { api } from '../../api/client';
import type { ProgramItem, ProgramItemType } from '../../types';

const TYPE_LABELS: Record<ProgramItemType, string> = {
  LAB: 'Лабораторные',
  THEORY: 'Теория',
  PRACTICE: 'Практика',
  TEST: 'Контрольные',
  ORAL: 'Устные опросы',
};

const TYPE_ICONS: Record<ProgramItemType, React.ReactNode> = {
  LAB: <ScienceIcon />,
  THEORY: <MenuBookIcon />,
  PRACTICE: <BuildIcon />,
  TEST: <QuizIcon />,
  ORAL: <RecordVoiceOverIcon />,
};

interface SubjectData {
  teacherSubject: {
    id: number;
    subject: { name: string };
    group: { name: string };
    teacher: string;
  };
  program: ProgramItem[];
  gradesByType: Record<string, { title: string; grade: number | null; date: string | null }[]>;
}

export default function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SubjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<SubjectData>(`/program/subject/${id}`).then((r) => {
      setData(r.data);
      setLoading(false);
    });
  }, [id]);

  if (loading || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const types: ProgramItemType[] = ['LAB', 'THEORY', 'PRACTICE', 'TEST', 'ORAL'];

  return (
    <Box>
      <Typography variant="h4">{data.teacherSubject.subject.name}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {data.teacherSubject.teacher} · {data.teacherSubject.group.name}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {types.map((type) => {
          const grades = data.gradesByType[type] ?? [];
          const withGrades = grades.filter((g) => g.grade);
          const avg =
            withGrades.length > 0
              ? withGrades.reduce((s, g) => s + (g.grade ?? 0), 0) / withGrades.length
              : null;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={type}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 1 }}>{TYPE_ICONS[type]}</Box>
                  <Typography variant="body2" color="text.secondary">
                    {TYPE_LABELS[type]}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: avg ? 'primary.main' : 'text.disabled' }}>
                    {avg ? avg.toFixed(1) : '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {grades.length} занятий
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Typography variant="h6" gutterBottom>
        Программа занятий
      </Typography>
      <Card>
        <List>
          {data.program.map((item, i) => (
            <Box key={item.id}>
              {i > 0 && <Divider />}
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => item.type === 'LAB' && navigate(`/lab/${item.id}`)}
                  disabled={item.type !== 'LAB'}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={TYPE_LABELS[item.type]} size="small" variant="outlined" />
                        {item.title}
                        {item.isTeamWork && <Chip label="Команда" size="small" color="secondary" />}
                      </Box>
                    }
                    secondary={
                      item.deadline
                        ? `Дедлайн: ${new Date(item.deadline).toLocaleDateString('ru-RU')}`
                        : item.description
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Box>
          ))}
        </List>
      </Card>
    </Box>
  );
}
