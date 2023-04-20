// Define the path to the file that contains the emoji and movie title pairs
var filePath = "C:\\path\\to\\videoContent.txt";

// Read the contents of the file
var file = File(filePath);
file.open("r");
var contents = file.read();
file.close();

// Split the contents into an array of emoji and movie title pairs
var pairs = contents.split(",");

// Define the duration of each quiz in seconds
var quizDuration = 10;

// Define the tick-tock sound
var tickTock = new AudioSample("ticktock.wav");

// Open Adobe Premiere and create a new sequence
app.openDocument("mySequence.prproj");
var sequence = app.project.activeSequence;

// Iterate over the emoji and movie title pairs
for (var i = 0; i < pairs.length; i++) {
  // Split the pair into an emoji and a movie title
  var pair = pairs[i].split(",");
  var emoji = pair[0];
  var movieTitle = pair[1];

  // Create a new clip in the sequence with the emoji
  var clip = sequence.clips.add(new File("myEmoji.png"));
  clip.start = i * quizDuration;
  clip.end = (i + 1) * quizDuration;

  // Add a countdown timer below the emoji
  var timer = sequence.titles.create("Timer", 10, 100, 100, 50);
  timer.text = quizDuration.toString();
  timer.font.name = "Arial";
  timer.font.size = 32;
  timer.color = [1, 1, 1];
  timer.alignment = 3; // center alignment
  timer.start = clip.start;
  timer.end = clip.end;

  // Add tick-tock sound that gradually gets louder
  for (var j = 5; j >= 0; j--) {
    var volume = j / 5; // calculate the volume level
    tickTock.volume = volume;
    clip.audioTracks[0].addClip(tickTock, clip.start + (5 - j), clip.start + (5 - j + 1));
  }

  // Add the movie title after the timer hits 0
  var title = sequence.titles.create("Title", 10, 200, 100, 50);
  title.text = movieTitle;
  title.font.name = "Arial";
  title.font.size = 32;
  title.color = [1, 1, 1];
  title.alignment = 3; // center alignment
  title.start = clip.end;
  title.end = clip.end + 2;

  // Add a black background to all sections of the video
  clip.setFillColor(0, 0, 0);
  timer.setFillColor(0, 0, 0);
  title.setFillColor(0, 0, 0);
}

// Add the "Thanks for watching" screen
var thanks = sequence.titles.create("Thanks", 10, 100, 100, 50);
thanks.text = "Thanks for watching! Don't forget to like, comment, and subscribe!";
thanks.font.name = "Arial";
thanks.font.size = 32;
thanks.color = [1, 1, 1];
thanks.alignment = 3; // center alignment
thanks.start = pairs.length * quizDuration;
thanks.end = thanks.start + 5;

// Add a black background to the thanks screen
thanks.setFillColor(0, 0, 0);

// Export the sequence to a user-defined filename and location
var exportFileName = prompt("Enter a filename for the exported video:");
var exportPath = "~/Desktop/Exported Videos/"; // Change this to the desired export directory

// Create the export folder if it doesn't exist
var exportFolder = new Folder(exportPath);
if (!exportFolder.exists) {
  exportFolder.create();
}

// Set the export settings
var exportOptions = new ExportOptions();
exportOptions.codec = "H.264";
exportOptions.outPreset = "YouTube 1080p Full HD";
exportOptions.exportVideoBitrate = 8;
exportOptions.frameRate = 29.97;
exportOptions.audioBitrate = 320;
exportOptions.audioChannels = 2;
exportOptions.audioSampleRate = 44100;
exportOptions.timeSpan = app.project.activeSequence.timebase * app.project.activeSequence.duration;

// Export the sequence
app.project.activeSequence.exportAsMediaDirect(exportPath + exportFileName, "H.264", exportOptions);

// Display a message indicating that the export is complete
alert("Video exported successfully to " + exportPath + exportFileName + "!");

// Save and close the sequence
app.project.save();
app.project.closeDocument();

// Display a message indicating that the script has finished
alert("Video quizzes generated successfully!");
