using System;
using System.IO;

using Microsoft.Extensions.CommandLineUtils;

namespace Backend.Console
{
    class Program
    {
        static void Main(string[] args)
        {
            var app = new CommandLineApplication();

            app.Command("version", command =>
            {
                command.Description = "Backend version";

                command.OnExecute(() =>
                {
                    var version = new Version(0, 2, 0);
                    WriteVersionToConsole(version);
                    return 0;
                });
            });

            app.Execute(args);
        }

        private static void WriteVersionToConsole(Version version)
        {
            var output = System.Console.Out as TextWriter;
            output.WriteLine($@"{{""version"": ""{version}""}}");
        }
    }
}
