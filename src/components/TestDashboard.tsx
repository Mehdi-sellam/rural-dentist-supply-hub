
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WebsiteTester } from '@/utils/websiteTester';
import { Loader2, Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TestResult {
  functionality: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  details?: any;
}

const TestDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setHasRun(false);

    try {
      const tester = new WebsiteTester();
      const testResults = await tester.runAllTests();
      setResults(testResults);
      setHasRun(true);
    } catch (error) {
      console.error('Test execution failed:', error);
      setResults([{
        functionality: 'Test Suite',
        status: 'failed',
        message: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const passed = results.filter(r => r.status === 'passed').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const warnings = results.filter(r => r.status === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Functionality Test Suite</h1>
        <p className="text-gray-600">Comprehensive testing of all website functionalities with backend service</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Test Dashboard
          </CardTitle>
          <p className="text-muted-foreground">
            Run comprehensive tests to verify all website functionalities are working correctly
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Controls */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run All Tests
                </>
              )}
            </Button>
            
            {hasRun && (
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-green-700">
                  ✅ Passed: {passed}
                </Badge>
                <Badge variant="outline" className="text-red-700">
                  ❌ Failed: {failed}
                </Badge>
                <Badge variant="outline" className="text-yellow-700">
                  ⚠️ Warnings: {warnings}
                </Badge>
              </div>
            )}
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              <ScrollArea className="h-96 w-full border rounded-md p-4">
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {getStatusIcon(result.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{result.functionality}</h4>
                              {getStatusBadge(result.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {result.message}
                            </p>
                            {result.details && (
                              <details className="mt-2">
                                <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                                  Show Details
                                </summary>
                                <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                                  {JSON.stringify(result.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Test Information</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• This test suite will create sample data in your database</p>
              <p>• Authentication tests require you to be logged in first at <code>/auth</code></p>
              <p>• Cart and order tests require authentication</p>
              <p>• Test data will be cleaned up and recreated automatically</p>
              <p>• Check the browser console for detailed logs during testing</p>
              <p>• Tests include: Authentication, Database Operations, Cart Functions, Orders</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDashboard;
