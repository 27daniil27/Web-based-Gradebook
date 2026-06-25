import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  alpha,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoomIcon from '@mui/icons-material/Room';
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { api } from '../api/client';
import type { ScheduleEntry } from '../types';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { brand } from '../theme';

const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const DAY_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#16a34a', '#f59e0b', '#0891b2'];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const today = new Date().getDay();

  useEffect(() => {
    api.get<ScheduleEntry[]>('/schedule').then((r) => {
      setSchedule(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const todayLessons = schedule.filter((s) => s.dayOfWeek === today);
  const weekDays = [1, 2, 3, 4, 5, 6].filter((day) => schedule.some((s) => s.dayOfWeek === day));

  return (
    <Box>
      <PageHeader
        title="Расписание"
        subtitle={user?.role === 'TEACHER' ? 'Ваши занятия на неделю' : 'Расписание вашей группы'}
      />

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <StatCard
          label="Сегодня"
          value={todayLessons.length}
          color={brand.blue}
          icon={<TodayIcon fontSize="small" sx={{ color: brand.blue }} />}
        />
        <StatCard
          label="На неделе"
          value={schedule.length}
          color={brand.violet}
          icon={<EventNoteIcon fontSize="small" sx={{ color: brand.violet }} />}
        />
        <StatCard
          label="Дней с парами"
          value={weekDays.length}
          color="#16a34a"
          icon={<AccessTimeIcon fontSize="small" sx={{ color: '#16a34a' }} />}
        />
      </Box>

      {todayLessons.length > 0 && (
        <Card
          sx={{
            mb: 3,
            border: '2px solid',
            borderColor: alpha(brand.blue, 0.3),
            background: `linear-gradient(135deg, ${alpha(brand.blue, 0.06)} 0%, ${alpha(brand.violet, 0.04)} 100%)`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 700 }}>
              Сегодня — {DAYS[today]}
            </Typography>
            <Grid container spacing={2}>
              {todayLessons.map((lesson) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={lesson.id}>
                  <LessonCard lesson={lesson} highlight />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {weekDays.map((day) => {
        const lessons = schedule.filter((s) => s.dayOfWeek === day);
        return (
          <Box key={day} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
              <Chip
                label={DAY_SHORT[day]}
                size="small"
                color={day === today ? 'primary' : 'default'}
                sx={{ fontWeight: 700 }}
              />
              {DAYS[day]}
            </Typography>
            <Grid container spacing={2}>
              {lessons.map((lesson, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={lesson.id}>
                  <LessonCard lesson={lesson} color={COLORS[i % COLORS.length]} />
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
}

function LessonCard({
  lesson,
  highlight,
  color = '#2563eb',
}: {
  lesson: ScheduleEntry;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <Card
      sx={{
        height: '100%',
        borderLeft: `4px solid ${color}`,
        ...(highlight && {
          bgcolor: alpha(brand.blue, 0.04),
          transform: 'scale(1)',
        }),
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {lesson.subject.name}
        </Typography>
        <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon fontSize="small" sx={{ color }} />
            <Typography variant="body2">
              {lesson.startTime} — {lesson.endTime}
            </Typography>
          </Box>
          {lesson.room && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RoomIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2">Ауд. {lesson.room}</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2">
              {lesson.teacher.name} · {lesson.group.name}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
