import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Link,
  Avatar,
  AvatarGroup,
  Stack,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { api, FILE_BASE } from '../../api/client';

interface LabData {
  id: number;
  title: string;
  description: string | null;
  deadline: string | null;
  assignmentFile: string | null;
  theoryMaterials: string | null;
  isTeamWork: boolean;
  teammates: { id: number; name: string }[];
  submission: {
    id: number;
    filePath: string | null;
    originalFileName: string | null;
    submittedAt: string | null;
    grade: number | null;
    teacherComment: string | null;
    status: string;
  } | null;
}

export default function LabPage() {
  const { id } = useParams<{ id: string }>();
  const [lab, setLab] = useState<LabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    api.get<LabData>(`/program/lab/${id}`).then((r) => {
      setLab(r.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setMessage('');
    const form = new FormData();
    form.append('file', file);
    try {
      await api.post(`/program/lab/${id}/submit`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Работа успешно отправлена!');
      load();
    } catch {
      setMessage('Ошибка при загрузке файла');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !lab) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isOverdue = lab.deadline && new Date(lab.deadline) < new Date() && !lab.submission?.submittedAt;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {lab.title}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {lab.deadline && (
          <Chip
            label={`Дедлайн: ${new Date(lab.deadline).toLocaleDateString('ru-RU')}`}
            color={isOverdue ? 'error' : 'default'}
          />
        )}
        {lab.isTeamWork && <Chip label="Командная работа" color="secondary" />}
        {lab.submission?.status === 'GRADED' && (
          <Chip icon={<CheckCircleIcon />} label={`Оценка: ${lab.submission.grade}`} color="success" />
        )}
      </Stack>

      {message && (
        <Alert severity={message.includes('Ошибка') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Grid2Container>
        <Card sx={{ flex: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Описание
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {lab.description ?? 'Описание не указано'}
            </Typography>

            {lab.assignmentFile && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                href={`${FILE_BASE}${lab.assignmentFile}`}
                target="_blank"
                sx={{ mr: 1 }}
              >
                Скачать ТЗ
              </Button>
            )}

            {lab.theoryMaterials && (
              <Button variant="outlined" component={Link} href={lab.theoryMaterials} target="_blank">
                Теоретические материалы
              </Button>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Ваше решение
            </Typography>

            {lab.submission?.filePath ? (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Файл: {lab.submission.originalFileName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Отправлено: {lab.submission.submittedAt && new Date(lab.submission.submittedAt).toLocaleString('ru-RU')}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  href={`${FILE_BASE}${lab.submission.filePath}`}
                  target="_blank"
                  sx={{ mr: 1 }}
                >
                  Скачать
                </Button>
                <Button variant="contained" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  Перезагрузить
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<UploadFileIcon />}
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Загрузка...' : 'Прикрепить решение'}
              </Button>
            )}

            <input
              ref={fileRef}
              type="file"
              hidden
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </CardContent>
        </Card>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {lab.isTeamWork && lab.teammates.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Напарники
                </Typography>
                <AvatarGroup max={5}>
                  {lab.teammates.map((t) => (
                    <Avatar key={t.id} title={t.name}>
                      {t.name[0]}
                    </Avatar>
                  ))}
                </AvatarGroup>
                {lab.teammates.map((t) => (
                  <Typography key={t.id} variant="body2" sx={{ mt: 1 }}>
                    {t.name}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          )}

          {lab.submission?.teacherComment && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Комментарий преподавателя
                </Typography>
                <Typography>{lab.submission.teacherComment}</Typography>
                {lab.submission.grade && (
                  <Chip label={`Оценка: ${lab.submission.grade}`} color="success" sx={{ mt: 2 }} />
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Grid2Container>
    </Box>
  );
}

function Grid2Container({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
      {children}
    </Box>
  );
}
