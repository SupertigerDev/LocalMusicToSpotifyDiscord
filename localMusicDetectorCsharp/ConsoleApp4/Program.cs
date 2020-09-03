using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Media.Control;
using System.Web.Script.Serialization;

namespace ConsoleApp4
{
    class Program
    {
        static void Main(string[] args)
        {
            var gsmtcsm = GlobalSystemMediaTransportControlsSessionManager.RequestAsync().GetAwaiter().GetResult().GetCurrentSession();
            if (gsmtcsm != null)
            {
                var mediaProperties = gsmtcsm.TryGetMediaPropertiesAsync().GetAwaiter().GetResult();

                var media = new Media
                {
                    Artist = mediaProperties.Artist,
                    Title = mediaProperties.Title
                };
                var json = new JavaScriptSerializer().Serialize(media);
                Console.WriteLine(json);
            } else
            {
                Console.WriteLine("null");
            }
        }
    }
}

public class Media
{
    public string Artist { get; set; }
    public string Title { get; set; }
}
