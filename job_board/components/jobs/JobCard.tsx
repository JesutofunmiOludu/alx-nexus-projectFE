// Job Card Component - Display job listing

import { Job } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapPin, Briefcase, DollarSign, Clock, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { stripHtml } from '@/lib/utils';

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}

export function JobCard({ job, onSave, isSaved = false }: JobCardProps) {
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(job.id);
    }
  };

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card hover className="relative">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <CardTitle className="hover:text-indigo-600 transition-colors">
                  {job.title}
                </CardTitle>
                <p className="text-sm text-gray-600">{job.company.name}</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-gray-700 text-sm line-clamp-2 mb-4">
            {stripHtml(job.description)}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills_required.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="primary" size="sm">
                {skill}
              </Badge>
            ))}
            {job.skills_required.length > 3 && (
              <Badge variant="default" size="sm">
                +{job.skills_required.length - 3} more
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1.5" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              {job.job_type}
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1.5" />
              {job.salary_min && job.salary_max
                ? `${job.salary_currency}${job.salary_min / 1000}k - ${job.salary_max / 1000}k`
                : 'Competitive'}
            </div>
            <div className="flex items-center">
              <Badge variant={job.is_remote ? 'success' : 'default'} size="sm">
                {job.is_remote ? 'Remote' : 'On-site'}
              </Badge>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="primary" fullWidth>
            Apply Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
