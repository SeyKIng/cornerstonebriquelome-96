
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LocationMap } from "@/components/LocationMap";
import { Mail, MapPin, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    toast.success("Message envoyé avec succès!");
    reset();
    setRecordingComplete(false);
  };
  
  const startRecording = () => {
    setIsRecording(true);
    setRecordingComplete(false);
    setRecordingTime(0);
    
    // Simulate recording progress
    const interval = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) {
          clearInterval(interval);
          setIsRecording(false);
          setRecordingComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    setRecordingComplete(true);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8 text-cornerstone-blue text-center">Contactez-nous</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-bold">Envoyez-nous un message</h2>
              <p className="text-gray-600">
                Nous sommes là pour répondre à toutes vos questions.
              </p>
            </div>

            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="text">Message écrit</TabsTrigger>
                <TabsTrigger value="audio">Message vocal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Votre nom"
                      {...register("name", { required: true })}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">Le nom est requis</span>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Votre email"
                      type="email"
                      {...register("email", { required: true })}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        L'email est requis
                      </span>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Sujet"
                      {...register("subject", { required: true })}
                      className={errors.subject ? "border-red-500" : ""}
                    />
                    {errors.subject && (
                      <span className="text-red-500 text-sm">
                        Le sujet est requis
                      </span>
                    )}
                  </div>

                  <div>
                    <Textarea
                      placeholder="Votre message"
                      rows={6}
                      {...register("message", { required: true })}
                      className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && (
                      <span className="text-red-500 text-sm">
                        Le message est requis
                      </span>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    Envoyer
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="audio">
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Votre nom"
                      {...register("audioName", { required: true })}
                    />
                  </div>
                  
                  <div>
                    <Input
                      placeholder="Votre email"
                      type="email"
                      {...register("audioEmail", { required: true })}
                    />
                  </div>
                  
                  <div>
                    <Input
                      placeholder="Sujet"
                      {...register("audioSubject", { required: true })}
                    />
                  </div>
                  
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center min-h-[160px]">
                    {!isRecording && !recordingComplete ? (
                      <Button 
                        onClick={startRecording} 
                        variant="outline"
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        Commencer l'enregistrement
                      </Button>
                    ) : isRecording ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                          <span>Enregistrement en cours... {recordingTime}s</span>
                        </div>
                        <Button onClick={stopRecording} variant="outline">
                          Arrêter l'enregistrement
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-green-500 font-medium">Enregistrement terminé!</div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={startRecording}
                            variant="outline" 
                            className="text-sm"
                          >
                            Réenregistrer
                          </Button>
                          <Button 
                            onClick={onSubmit}
                            className="bg-cornerstone-orange hover:bg-cornerstone-orange/90 text-sm"
                          >
                            Envoyer l'audio
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-bold">Nos coordonnées</h2>
              <p className="text-gray-600">
                N'hésitez pas à nous contacter directement.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Adresse</h3>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=21+Rue+Be+HEDJE+Akodeséwa+Togo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-cornerstone-orange hover:underline"
                  >
                    21 Rue Be HEDJE, Akodéséwa, Togo
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a
                    href="mailto:contact@cornerstonebrique.com"
                    className="text-primary hover:underline"
                  >
                    contact@cornerstonebrique.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Téléphone</h3>
                  <div className="flex items-center gap-4">
                    <a 
                      href="tel:+22871014747"
                      className="text-gray-600 hover:text-cornerstone-orange hover:underline"
                    >
                      +228 71014747
                    </a>
                    <a 
                      href="https://wa.me/22871014747" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#25D366] p-1.5 rounded-full"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="white"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64 mt-8 rounded-lg overflow-hidden">
              <LocationMap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
