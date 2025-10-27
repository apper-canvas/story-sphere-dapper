import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactApexChart from "react-apexcharts";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatNumber, formatDate } from "@/utils/formatters";
import { analyticsService } from "@/services/api/analyticsService";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");

  const timeRanges = [
    { key: "7d", label: "Last 7 days" },
    { key: "30d", label: "Last 30 days" },
    { key: "90d", label: "Last 3 months" },
    { key: "1y", label: "Last year" }
  ];

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getDashboard(timeRange);
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const handleRetry = () => {
    loadAnalytics();
  };

  // Chart configuration
  const viewsChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      background: 'transparent'
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        colorStops: [
          { offset: 0, color: '#10b981', opacity: 0.4 },
          { offset: 100, color: '#10b981', opacity: 0.1 }
        ]
      }
    },
    colors: ['#10b981'],
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#6b7280' } }
    },
    yaxis: {
      labels: { style: { colors: '#6b7280' } }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3
    },
    tooltip: {
      theme: 'dark'
    }
  };

  const engagementChartOptions = {
    chart: {
      type: 'donut',
      height: 300,
      background: 'transparent'
    },
    colors: ['#10b981', '#3b82f6', '#f59e0b'],
    labels: ['Likes', 'Comments', 'Bookmarks'],
    legend: {
      position: 'bottom',
      labels: { colors: '#6b7280' }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: { color: '#9ca3af' },
            value: { color: '#f3f4f6' }
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Error
            title="Failed to load analytics"
            message={error}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Empty
            title="No analytics data"
            message="Start writing and publishing stories to see your analytics."
            icon="BarChart3"
            actionLabel="Write a Story"
            onAction={() => window.location.href = "/write"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-slate-100 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Track your story performance and audience engagement
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            {timeRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeRange === range.key
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Views",
              value: analytics.totalViews,
              change: analytics.viewsChange,
              icon: "Eye",
              color: "blue"
            },
            {
              title: "Total Likes",
              value: analytics.totalLikes,
              change: analytics.likesChange,
              icon: "Heart",
              color: "red"
            },
            {
              title: "Comments",
              value: analytics.totalComments,
              change: analytics.commentsChange,
              icon: "MessageCircle",
              color: "green"
            },
            {
              title: "Followers",
              value: analytics.totalFollowers,
              change: analytics.followersChange,
              icon: "Users",
              color: "purple"
            }
          ].map((metric, index) => (
            <div
              key={metric.title}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${metric.color}-100 dark:bg-${metric.color}-900/30 rounded-lg flex items-center justify-center`}>
                  <ApperIcon name={metric.icon} className={`w-6 h-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                </div>
                
                <div className={`flex items-center gap-1 text-sm ${
                  metric.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  <ApperIcon 
                    name={metric.change >= 0 ? "TrendingUp" : "TrendingDown"} 
                    className="w-4 h-4" 
                  />
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
              
              <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1">
                {formatNumber(metric.value)}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-slate-500">
                {metric.title}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Views Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">
                Views Over Time
              </h3>
              
              <ReactApexChart
                options={viewsChartOptions}
                series={[{
                  name: 'Views',
                  data: analytics.viewsData
                }]}
                type="area"
                height={350}
              />
            </div>
          </motion.div>

          {/* Engagement Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">
                Engagement Breakdown
              </h3>
              
              <ReactApexChart
                options={engagementChartOptions}
                series={[analytics.totalLikes, analytics.totalComments, analytics.totalBookmarks]}
                type="donut"
                height={300}
              />
            </div>
          </motion.div>
        </div>

        {/* Top Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">
              Top Performing Stories
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                      Story
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                      Published
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                      Views
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                      Likes
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-gray-600 dark:text-slate-400">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topStories.map((story, index) => (
                    <tr key={story.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-4 px-2">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-slate-100 line-clamp-1">
                            {story.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-slate-500 line-clamp-1">
                            {story.subtitle}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-600 dark:text-slate-400">
                        {formatDate(story.publishedAt)}
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-600 dark:text-slate-400">
                          <ApperIcon name="Eye" className="w-4 h-4" />
                          <span className="font-medium">{formatNumber(story.viewCount)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center gap-1 text-red-500">
                          <ApperIcon name="Heart" className="w-4 h-4" />
                          <span className="font-medium">{formatNumber(story.likeCount)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div className="flex items-center justify-center gap-1 text-green-500">
                          <ApperIcon name="MessageCircle" className="w-4 h-4" />
                          <span className="font-medium">{formatNumber(story.commentCount)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;